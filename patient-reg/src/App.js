import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Sidebar from './components/Sidebar';
import PatientForm from './components/PatientForm';
import api from './api';

export default function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [dateFilter, setDateFilter] = useState('');

  async function fetchPatients(date) {
    try {
      const res = await api.getPatients(date);
      setPatients(res.data || []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (dateFilter) fetchPatients(dateFilter);
    else fetchPatients();
  }, [dateFilter]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={
          <div className="app-shell">
            <Sidebar
              patients={patients}
              onSelect={p => setSelectedPatient(p)}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              refresh={() => fetchPatients(dateFilter)}
            />
            <main className="main-area">
              <header className="topbar">
                <h2>Patient Registration</h2>
                <p>Register new patient and assign diagnostic tests</p>
              </header>
              <div className="content-grid">
                <PatientForm
                  initial={selectedPatient}
                  onSaved={() => {
                    fetchPatients(dateFilter);
                    setSelectedPatient(null);
                  }}
                />
              </div>
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}
