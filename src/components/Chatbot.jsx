'use client';

import { useState } from 'react';

const Chatbot = ({ onRecommend }) => {
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [sector, setSector] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRecommend({
      education,
      skills: skills.split(',').map(skill => skill.trim()),
      sector,
      location,
    });
  };

  return (
    <div className="chatbot-container">
      <h2>Find Your Internship</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Education (e.g., B.Tech, MBA)</label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Enter your education"
          />
        </div>
        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., React, Python, SEO"
          />
        </div>
        <div className="form-group">
          <label>Sector of Interest</label>
          <input
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="e.g., IT, Marketing, Data Science"
          />
        </div>
        <div className="form-group">
          <label>Preferred Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Bangalore, Mumbai"
          />
        </div>
        <button type="submit">Get Recommendations</button>
      </form>
    </div>
  );
};

export default Chatbot;
