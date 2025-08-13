import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Row, Col, Alert, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSuccess('');
    setError('');
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/auth/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('✅ Profile updated successfully!');
    } catch (err) {
      setError('❌ Failed to update profile.');
    }
  };

  return (
    <div className="profile-bg py-5">
      <Container>
        <h2 className="text-center mb-4">👤 My Profile</h2>

        {loading ? (
          <Card className="shadow p-4 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading profile...</p>
          </Card>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : profile ? (
          <Card className="profile-card p-4">
            {success && <Alert variant="success">{success}</Alert>}

            <Row>
              <Col md={6} className="profile-section">
                <h5 className="profile-heading mb-3">👤 Personal Details</h5>

                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control name="firstName" value={profile.firstName || ''} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control name="lastName" value={profile.lastName || ''} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email (readonly)</Form.Label>
                  <Form.Control name="email" value={profile.email} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control name="dob" type="date" value={profile.dob?.slice(0, 10) || ''} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control name="age" value={profile.age || ''} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={6} className="profile-section">
                <h5 className="profile-heading mb-3">🎓 Academic & Location</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Field of Study</Form.Label>
                  <Form.Control name="study" value={profile.study || ''} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control name="location" value={profile.location || ''} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button variant="success" onClick={handleSave}>
                💾 Save Profile
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="shadow p-4 text-center">
            <p>No profile found.</p>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default Profile;
