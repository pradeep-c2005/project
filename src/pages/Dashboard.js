import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import {
  ClipboardCheck,
  BarChart,
  Book,
  PersonCircle,
  BoxArrowRight
} from 'react-bootstrap-icons';

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/login');
  //     return;
  //   }

  //   axios.get('http://localhost:5000/api/auth/profile', {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //   .then((res) => {
  //     const user = res.data;
  //     setUserName(user.firstName ? `${user.firstName} ${user.lastName}` : user.email?.split('@')[0] || 'User');
  //   })
  //   .catch((err) => {
  //     console.error('Error fetching profile:', err);
  //     toast.error('Session expired. Please log in again.');
  //     localStorage.removeItem('token');
  //     setTimeout(() => navigate('/login'), 1500);
  //   });
  // }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    toast.success('👋 Signed out successfully!');
    setTimeout(() => navigate('/dashboard'), 999999999);
  };

  const features = [
    {
      title: 'Practice',
      description: 'Sharpen your skills with topic-wise questions.',
      icon: <ClipboardCheck size={32} />,
      onClick: () => navigate('/practice'),
      highlight: true
    },
    {
      title: 'Progress',
      description: 'Track your score and accuracy trends.',
      icon: <BarChart size={32} />,
      onClick: () => navigate('/Tracking')
    },
    {
      title: 'Review',
      description: 'Review your attempted questions and solutions.',
      icon: <Book size={32} />,
      onClick: () => navigate('/Review')
    },
    {
      title: 'Profile',
      description: 'View and manage your personal details.',
      icon: <PersonCircle size={32} />,
      onClick: () => navigate('/profile')
    }
  ];

  return (
    <div className="modern-dashboard">
      <div className="top-bar">
        <div className="welcome-text">👋 Welcome, {userName}</div>
        <button className="signout-btn" onClick={handleSignOut}>
          <BoxArrowRight className="me-1" /> Sign Out
        </button>
      </div>

      <div className="text-center mb-5 mt-3">
        <p className="subtitle">AptiTrack</p>
        <h2 className="headline">We’re ready to help you improve your aptitude</h2>
        <p className="text">
          “Success is not final, failure is not fatal: it is the courage to continue that counts.” ― Winston Churchill
        </p>
      </div>

      <div className="card-container">
        {features.map((item, index) => (
          <div
            className={`modern-card ${item.highlight ? 'highlight-card' : ''}`}
            key={index}
            onClick={item.onClick}
          >
            <div className="icon-box">{item.icon}</div>
            <h5>{item.title}</h5>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}

export default Dashboard;