from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

app = FastAPI()

# Load internships data
with open('../src/app/internships.json') as f:
    internships = json.load(f)

# Preprocess data for TF-IDF
for internship in internships:
    internship['joined_text'] = ' '.join(internship['skills']) + ' ' + internship['title'] + ' ' + internship['sector']

corpus = [intern['joined_text'] for intern in internships]
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(corpus)

class Profile(BaseModel):
    education: str
    skills: list[str]
    sector: str
    location: str

def education_rank(education):
    rank = {
        '12th': 1,
        'Diploma': 2,
        'B.Tech': 3,
        'MBA': 3,
        'Any Graduate': 0
    }
    return rank.get(education, 0)

@app.post("/api/recommend")
def recommend(profile: Profile):
    # 1. Rule-based filtering
    eligible_internships = []
    for internship in internships:
        if education_rank(profile.education) >= education_rank(internship['education']):
            if not profile.sector or profile.sector.lower() == internship['sector'].lower():
                eligible_internships.append(internship)

    if not eligible_internships:
        return {"recommendations": []}

    # 2. ML-light scoring (TF-IDF)
    candidate_joined_text = ' '.join(profile.skills) + ' ' + profile.sector
    candidate_vec = vectorizer.transform([candidate_joined_text])
    
    eligible_corpus = [intern['joined_text'] for intern in eligible_internships]
    eligible_tfidf_matrix = vectorizer.transform(eligible_corpus)

    sims = cosine_similarity(candidate_vec, eligible_tfidf_matrix).flatten()

    scored_internships = []
    for i, internship in enumerate(eligible_internships):
        scored_internships.append({
            **internship,
            "score": sims[i]
        })

    # 3. Location boost
    for internship in scored_internships:
        if profile.location and profile.location.lower() == internship['location'].lower():
            internship['score'] += 0.2

    # 4. Final sorting
    sorted_internships = sorted(scored_internships, key=lambda x: x['score'], reverse=True)
    
    # Add matched/missing skills
    recommendations = []
    for internship in sorted_internships[:3]:
        matched_skills = [skill for skill in internship['skills'] if skill in profile.skills]
        missing_skills = [skill for skill in internship['skills'] if skill not in profile.skills]
        recommendations.append({
            **internship,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills
        })

    return {"recommendations": recommendations}
