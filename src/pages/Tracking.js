// 🔁 Enhanced Tracking.js (without download selected charts button)
import React, { useEffect, useState, useRef } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  AreaChart, Area, ResponsiveContainer, CartesianGrid, Legend, LabelList
} from 'recharts';
import axios from 'axios';
import './Tracking.css';

const COLORS = ['#14b8a6', '#f97316'];

function Tracking() {
  const [data, setData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [filterTopic, setFilterTopic] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCharts, setSelectedCharts] = useState({ bar: true, pie: true, area: true });
  const ref = useRef();

  useEffect(() => {
    const fetchTrackingData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/tracking', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching tracking data:', err);
      }
    };
    fetchTrackingData();
  }, []);

  useEffect(() => {
    if (data.length) {
      const topicMap = {};
      const dailyMap = {};
      const timeArray = [];
      let correct = 0, wrong = 0;

      data.forEach(entry => {
        const { topic, score, total, date, responses, time } = entry;
        const entryDate = new Date(date);

        if (
          (!filterTopic || topic === filterTopic) &&
          (!fromDate || entryDate >= new Date(fromDate)) &&
          (!toDate || entryDate <= new Date(toDate))
        ) {
          topicMap[topic] = topicMap[topic] || { topic, score: 0, total: 0 };
          topicMap[topic].score += score;
          topicMap[topic].total += total;

          const formattedDate = entryDate.toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          });
          dailyMap[formattedDate] = (dailyMap[formattedDate] || 0) + 1;

          responses.forEach(res => res.isCorrect ? correct++ : wrong++);

          if (typeof time === 'number') timeArray.push(time);
        }
      });

      setBarData(Object.values(topicMap).map(e => ({
        ...e,
        percentage: ((e.score / e.total) * 100).toFixed(1)
      })));

      setPieData([
        { name: 'Correct', value: correct },
        { name: 'Wrong', value: wrong }
      ]);

      const sortedArea = Object.entries(dailyMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setAreaData(sortedArea);
      setTimeData(timeArray);
    }
  }, [data, filterTopic, fromDate, toDate]);

  const uniqueTopics = [...new Set(data.map(d => d.topic))];

  const handleChartToggle = (chart) => {
    setSelectedCharts(prev => ({ ...prev, [chart]: !prev[chart] }));
  };

  const avgTime = timeData.length ? (timeData.reduce((a, b) => a + b, 0) / timeData.length).toFixed(1) : null;

  return (
    <div className="track-bg py-5">
      <Container className="fade-in">
        <div className="tracking-header">
          <h3 className="fw-bold teal-text">📊 Aptitude Tracking Dashboard</h3>
        </div>

        <Row className="g-3 mb-4">
          <Col md={3}>
            <label className="form-label">From Date</label>
            <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </Col>
          <Col md={3}>
            <label className="form-label">To Date</label>
            <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </Col>
          <Col md={3}>
            <label className="form-label">Filter by Topic</label>
            <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="form-select">
              <option value=''>All Topics</option>
              {uniqueTopics.map((t, idx) => (
                <option key={idx} value={t}>{t.replace(/([A-Z])/g, ' $1').trim()}</option>
              ))}
            </select>
          </Col>
          <Col md={3}>
            <label className="form-label">Export Charts</label>
            <div className="d-flex gap-2 flex-wrap">
              {['bar', 'pie', 'area'].map(chart => (
                <div key={chart}>
                  <input type="checkbox" id={chart} checked={selectedCharts[chart]} onChange={() => handleChartToggle(chart)} />
                  <label htmlFor={chart} className="ms-1">{chart.toUpperCase()}</label>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        <div id="pdf-export" ref={ref}>
          {selectedCharts.bar && (
            <div className="chart-card" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="chart-title">📘 Topic-wise Accuracy Summary</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} className="animated-chart">
                  <XAxis dataKey="topic" tick={{ fill: '#1e293b', fontWeight: 600 }} />
                  <YAxis tick={{ fill: '#1e293b', fontWeight: 600 }} />
                  <Tooltip wrapperStyle={{ fontSize: '0.85rem', backgroundColor: '#ffffff' }} />
                  <Legend wrapperStyle={{ color: '#1e293b', fontSize: '0.9rem' }} />
                  <Bar dataKey="score" name="Score" fill="#0f766e">
                    <LabelList dataKey="percentage" position="top" style={{ fill: '#0f172a', fontWeight: 'bold' }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedCharts.pie && (
            <div className="chart-card" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="chart-title">✅ Overall Accuracy</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart className="animated-chart">
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#1e293b', fontSize: '0.9rem' }} />
                  <Tooltip wrapperStyle={{ fontSize: '0.85rem', backgroundColor: '#ffffff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedCharts.area && (
            <div className="chart-card" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="chart-title">📅 Quiz Attempts Per Day</h5>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={areaData} className="animated-chart">
                  <XAxis dataKey="date" tick={{ fill: '#1e293b', fontWeight: 600 }} />
                  <YAxis tick={{ fill: '#1e293b', fontWeight: 600 }} />
                  <CartesianGrid stroke="#e2e8f0" />
                  <Tooltip wrapperStyle={{ fontSize: '0.85rem', backgroundColor: '#ffffff' }} />
                  <Legend wrapperStyle={{ color: '#1e293b', fontSize: '0.9rem' }} />
                  <Area type="monotone" dataKey="count" name="Attempts" stroke="#3b82f6" fill="#bfdbfe" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {avgTime && (
            <div className="chart-card text-center" style={{ backgroundColor: '#ffffff' }}>
              <h6 className="text-muted">⏱ Average Time Taken Per Quiz: <strong>{(avgTime / 60).toFixed(2)} mins</strong></h6>
            </div>
          )}
        </div>

       <Row className="mt-4 justify-content-center">
        <Col xs="auto">
          <Button className="back-btn" onClick={() => window.location.href = '/dashboard'}>
            🔙 Back to Dashboard
          </Button>
        </Col>
      </Row>
      </Container>
    </div>
  );
}

export default Tracking;
