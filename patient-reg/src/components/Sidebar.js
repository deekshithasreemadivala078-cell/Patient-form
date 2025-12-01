// src/components/Sidebar.js
import React from 'react';
import api from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function formatPatient(p) {
  return {
    ...p,
    name: p.name || 'Unknown',
  };
}

export default function Sidebar({ patients, onSelect, dateFilter, setDateFilter, refresh }) {
  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient?')) {
      await api.deletePatient(id);
      refresh();
    }
  };
  const handleDateChange = (date) => {
    if (!date) return setDateFilter('');
    const iso = date.toISOString().slice(0, 10);
    setDateFilter(iso);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <h3>Recent Patients</h3>
        <div>
          <DatePicker
            placeholderText="Filter by date"
            selected={dateFilter ? new Date(dateFilter) : null}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
          <button onClick={() => { setDateFilter(''); refresh(); }} className="btn-small">Clear</button>
        </div>
      </div>

      <div className="patients-list">
        {patients.length === 0 && <div className="muted">No patients found</div>}
        {patients.map((p) => {
          const pd = formatPatient(p);
          return (
            <div key={p._id} className="patient-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div onClick={() => onSelect(p)} style={{cursor:'pointer',flex:1}}>
                <div className="name">{pd.name}</div>
                <div className="meta">{p.mobile || '—'}</div>
                <div className="meta small">{new Date(p.createdAt).toLocaleString()}</div>
              </div>
              {/* <button className="icon-btn" title="Delete" onClick={() => handleDelete(p._id)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 7.5V15.5C6.5 16.0523 6.94772 16.5 7.5 16.5H12.5C13.0523 16.5 13.5 16.0523 13.5 15.5V7.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="4.5" y="5.5" width="11" height="2" rx="1" fill="#ef4444"/>
                  <rect x="8" y="2.5" width="4" height="2" rx="1" fill="#ef4444"/>
                </svg>
              </button> */}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
