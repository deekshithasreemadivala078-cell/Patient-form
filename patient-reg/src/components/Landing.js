import React from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing-hero">
      <div className="top-right-shape" />
      <nav className="landing-nav">
        <div className="logo"> <span className="logo-icon">+</span> Delight diagnosticS </div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Doctors</a>
          <a href="#">Contact</a>
        </div>
      </nav>
      <div className="landing-content">
        <div className="landing-left">
          <h5>We Are Here For Your Care</h5>
          <h1>Best Care & Better Doctor</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra.</p>
          <button className="landing-btn" onClick={() => navigate('/register')}>REGISTER</button>
        </div>
       <div className="landing-right">
  <img src="/doctor.png" alt="Doctor" className="landing-img " />
</div>
      </div>
    </div>
  );
}
