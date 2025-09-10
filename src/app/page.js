'use client';

import { useState } from 'react';
import Chatbot from '../components/Chatbot';
import RecommendationCards from '../components/RecommendationCards';
export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [userSkills, setUserSkills] = useState([]);

  const getRecommendations = async (userInput) => {
    setUserSkills(userInput.skills);
    const res = await fetch('http://127.0.0.1:8000/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInput),
    });
    const data = await res.json();
    setRecommendations(data.recommendations);
  };

  return (
    <main className="container">
      <header>
        <h1>AI-Powered Internship Recommendation Engine</h1>
      </header>
      <Chatbot onRecommend={getRecommendations} />
      <RecommendationCards recommendations={recommendations} userSkills={userSkills} />
    </main>
  );
}
