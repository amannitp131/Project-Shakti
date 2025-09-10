import React from 'react';

const RecommendationCards = ({ recommendations, userSkills }) => {
  if (!recommendations.length) {
    return null;
  }

  return (
    <div className="recommendation-container">
      <h2>Top Recommendations</h2>
      <div className="cards-grid">
        {recommendations.map((internship) => (
          <div key={internship.id} className="card">
            <h3>{internship.title}</h3>
            <p><strong>{internship.company}</strong></p>
            <p>📍 {internship.location}</p>
            <div className="skills">
              <strong>Matched Skills:</strong>
              <ul>
                {internship.matched_skills.map((skill, index) => (
                  <li key={index} className="matched">
                    ✅ {skill}
                  </li>
                ))}
              </ul>
              <strong>Missing Skills:</strong>
              <ul>
                {internship.missing_skills.map((skill, index) => (
                  <li key={index} className="missing">
                    ❌ {skill}
                  </li>
                ))}
              </ul>
            </div>
            <button className="apply-button">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCards;
