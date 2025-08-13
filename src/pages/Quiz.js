import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Quiz.css';
import axios from 'axios';

function Quiz() {
  const { state } = useLocation();
  const { questions = [], topic = '' } = state || {};
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [time, setTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!questions.length) return <div className="quiz-container">No questions found!</div>;

  const currentQuestion = questions[current];
  const allAnswered = answers.every(ans => ans !== null);

  const handleSelect = (optionIndex) => {
    const updated = [...answers];
    updated[current] = optionIndex;
    setAnswers(updated);
  };

  const goNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      if (!allAnswered) {
        setShowWarning(true);
        return;
      }

      // Prepare responses
      const responses = questions.map((q, idx) => {
        const selectedOption = q.options?.[answers[idx]] || 'N/A';
        const correctAnswer = q.answer || 'N/A';
        return {
          question: q.question,
          selectedOption,
          correctAnswer,
          isCorrect: selectedOption === correctAnswer,
          explanation: q.explanation || 'N/A',
        };
      });

      const score = responses.filter(r => r.isCorrect).length;
      const total = questions.length;
      const date = new Date().toISOString();
      const resultData = { topic, score, total, date, responses, time };

      // 🔁 Save to backend
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post('http://localhost:5000/api/tracking', {
            topic, score, total, responses, time
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error("❌ Tracking data not saved:", err.response?.data || err.message);
        }
      }

      // 🔒 Optionally keep a copy in localStorage
      const existingResults = JSON.parse(localStorage.getItem('results') || '[]');
      localStorage.setItem('results', JSON.stringify([...existingResults, resultData]));

      const existingTrack = JSON.parse(localStorage.getItem('track') || '[]');
      localStorage.setItem('track', JSON.stringify([...existingTrack, resultData]));

      // ✅ Navigate to Result
      navigate('/result', { state: resultData });
    }
  };

  const goPrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const optionLabels = ['a', 'b', 'c', 'd'];

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="quiz-container">
      <div className="question-card">
        <div className="quiz-header-bar">
          <span className="quiz-topic">Topic: {topic.replace(/([A-Z])/g, ' $1').trim()}</span>
          <span className="quiz-timer">Time: {formatTime(time)}</span>
        </div>

        <div className="question-header">
          {`Q${current + 1}. ${currentQuestion.question}`}
        </div>

        <div className="options">
          {currentQuestion.options.map((opt, idx) => (
            <div
              key={idx}
              className={`option-button ${answers[current] === idx ? 'selected' : ''}`}
              onClick={() => handleSelect(idx)}
            >
              <span className="option-label">{optionLabels[idx]}</span>
              {opt}
            </div>
          ))}
        </div>

        <div className={`quiz-nav inside-card ${current === questions.length - 1 ? 'center-buttons' : ''}`}>
          {current > 0 && <button onClick={goPrev}>Previous</button>}
          <button onClick={goNext}>
            {current === questions.length - 1 ? 'Finish Test' : 'Next'}
          </button>
        </div>
      </div>

      {showWarning && (
        <div className="quiz-warning">
          <div className="quiz-warning-box">
            <p>⚠️ Please answer all questions before finishing the test.</p>
            <button onClick={() => setShowWarning(false)}>Okay</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
