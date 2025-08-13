import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      // ✅ Save token only
      localStorage.setItem('token', res.data.token);

      // ✅ Clear old frontend-tracked data
      localStorage.removeItem('track');
      localStorage.removeItem('results');

      alert('✅ Login successful! Redirecting...');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || '❌ Invalid email or password');
    }
  };

return (
    <div className="login-bg d-flex justify-content-center align-items-center">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="glass-card p-4 px-5 shadow-lg">
          <h2 className="text-center mb-4 fw-bold">Login to AptiTrack</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button type="submit" className="login-btn">
                Login
              </Button>
            </div>

            <div className="text-center">
              Don’t have an account? <a href="/register">Register here</a>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Login;