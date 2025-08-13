import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  Form,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import './Review.css';

function Review() {
  const [trackData, setTrackData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const pdfRef = useRef();

  // useEffect(() => {
  //   const fetchTrackData = async () => {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       navigate('/login');
  //       return;
  //     }

  //     try {
  //       const res = await axios.get('http://localhost:5000/api/tracking', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       setTrackData(res.data);
  //     } catch (err) {
  //       console.error('Failed to fetch tracking data:', err);
  //       if (err.response?.status === 401) {
  //         setError('Session expired. Please log in again.');
  //         localStorage.removeItem('token');
  //         setTimeout(() => navigate('/login'), 1500);
  //       } else {
  //         setError('Something went wrong while fetching data.');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTrackData();
  // }, [navigate]);

  useEffect(() => {
    let filtered = [...trackData];

    if (selectedTopic !== 'All') {
      filtered = filtered.filter((item) => item.topic === selectedTopic);
    }

    if (selectedDate !== 'All') {
      filtered = filtered.filter((item) => {
        const localDate = new Date(item.date).toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata'
        });
        return localDate === selectedDate;
      });
    }

    setFilteredData(filtered);
  }, [trackData, selectedTopic, selectedDate]);

  const formatIST = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const downloadReviewPDF = () => {
    const opt = {
      margin: 0.5,
      filename: `review-report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, backgroundColor: '#fff' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(pdfRef.current).save();
  };

  const allTopics = ['All', ...new Set(trackData.map((item) => item.topic))];

  const allDates = ['All', ...new Set(
    trackData.map((item) =>
      new Date(item.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
    )
  )];

  return (
    <div className="review-bg py-5">
      <Container>
        <Card className="review-card">
          <div className="review-header">
            <h3 className="fw-bold">📝 Review Questions</h3>
            <Button variant="dark" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          <Row className="review-filters mb-4">
            <Col md={6} className="mb-2">
              <label htmlFor="topicSelect" className="form-label fw-semibold">📚 Filter by Topic</label>
              <Form.Select
                id="topicSelect"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {allTopics.map((topic, idx) => (
                  <option key={idx} value={topic}>
                    {topic}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} className="mb-2">
              <label htmlFor="dateSelect" className="form-label fw-semibold">📅 Filter by Date</label>
              <Form.Select
                id="dateSelect"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {allDates.map((date, idx) => (
                  <option key={idx} value={date}>
                    {date}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          
          <div className="d-grid mb-4">
            <Button className="review-export-btn" onClick={downloadReviewPDF}>
              📥 Export to PDF
            </Button>
          </div>

          <div ref={pdfRef} className="pdf-wrapper">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading tracking data...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">{error}</div>
            ) : filteredData.length === 0 ? (
              <h6 className="review-no-data">No matching records found.</h6>
            ) : (
              filteredData.map((attempt, index) => (
                <Card className="mb-5 p-4 border-0 shadow-sm" key={index}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="review-date-time">
                        <span className="icon">📅</span> {formatIST(attempt.date)}
                      </div>
                      <h6>
                        <Badge bg="info" className="review-badge">{attempt.topic}</Badge> &nbsp;
                        <Badge bg="success" className="review-badge">Score: {attempt.score}/{attempt.total}</Badge>
                      </h6>
                    </div>
                  </div>

                  <Table bordered responsive hover className="review-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Your Answer</th>
                        <th>Correct Answer</th>
                        <th>Status</th>
                        <th>Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempt.responses.map((res, idx) => (
                        <tr key={idx}>
                          <td className="text-center">{idx + 1}</td>
                          <td>{res.question}</td>
                          <td className="text-primary">{res.selectedOption}</td>
                          <td className="text-success">{res.correctAnswer}</td>
                          <td className="text-center">
                            <Badge bg={res.isCorrect ? 'success' : 'danger'} className="review-badge">
                              {res.isCorrect ? 'Correct' : 'Wrong'}
                            </Badge>
                          </td>
                          <td>{res.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              ))
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default Review;
