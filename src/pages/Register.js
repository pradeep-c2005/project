import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    study: '',
    location: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords don't match");
      return;
    }

    const age = calculateAge(formData.dob);

    try {
      await axios.post('http://localhost:5000/api/auth/register', {

        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        age,
        study: formData.study,
        location: formData.location,
        email: formData.email,
        password: formData.password,
      });

      alert('✅ Registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      alert(`❌ Registration failed: ${err.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="register-page">
      <Form className="register-form" onSubmit={handleSubmit}>
        <div className="register-left">
          <h4>User Information</h4>
          <Row className="form-row">
            <Col>
              <Form.Control
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Form.Control
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <Form.Control
            type="text"
            placeholder="Field of Study"
            name="study"
            value={formData.study}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <Form.Control
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="mb-3"
          />
        </div>

        <div className="register-right">
          <h4>Account Setup</h4>

          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <Form.Control
            type="password"
            placeholder="Repeat Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <Button type="submit" className="register-btn">
            Register
          </Button>

          <div className="text-center mt-3">
            Already have an account?{' '}
            <a href="/login">Login</a>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Register;
