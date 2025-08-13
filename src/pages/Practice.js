import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopics, getAptiQuestions } from '../requests';
import './Practice.css';

function Practice() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTopics()
      .then((data) => setTopics(data))
      .catch((err) => {
        console.error("❌ Error loading topics:", err);
        setError("Failed to load topics");
      });
  }, []);

  const handleStart = async () => {
    if (!selectedTopic) {
      setError("Please select a topic");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const requests = Array.from({ length: numQuestions }, () =>
        getAptiQuestions(selectedTopic)
      );

      const results = await Promise.all(requests);
      const allQuestions = results.flat();

      navigate('/quiz', {
        state: {
          questions: allQuestions,
          topic: selectedTopic
        }
      });
    } catch (err) {
      console.error("❌ API Error:", err);
      setError("Failed to fetch questions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="practice-bg">
      <div className="practice-card">
        <h3 className="text-center">Aptitude Practice</h3>
        <p className="text-muted text-center small mb-4">
          “Small steps every day lead to big results.”
        </p>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label>Choose Topic</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">Select Topic</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Number of Questions</label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <button
          className="start-btn"
          onClick={handleStart}
          disabled={loading || !selectedTopic}
        >
          {loading ? 'Loading...' : 'Start Practice'}
        </button>
      </div>
    </div>
  );
}

export default Practice;
