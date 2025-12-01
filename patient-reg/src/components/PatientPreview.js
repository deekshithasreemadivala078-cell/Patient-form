import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PatientPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPatientData();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadPatientData = async () => {
    setLoading(true);
    // Replace with your API call
    const patientData = await fetch(`/api/patients/${id}`).then(res => res.json());
    setPatient(patientData);

    const testsData = await fetch(`/api/patient_tests?patient_id=${id}`).then(res => res.json());
    setTests(testsData || []);
    setLoading(false);
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading patient data...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>
          <p>Patient not found</p>
          <button onClick={() => navigate("/patient-registration")}>Go Back</button>
        </div>
      </div>
    );
  }

  const totalAmount = tests.reduce((sum, t) => sum + parseFloat(t.price || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 8px 32px rgba(30,64,175,0.22)",
        padding: "38px 48px",
        width: "700px",
        maxWidth: "95vw"
      }}>
        <h2 style={{ textAlign: "center", color: "#2563eb", fontWeight: 700, fontSize: "2rem" }}>Delight Diagnostics</h2>
        <div style={{ textAlign: "center", color: "#6b7280", fontSize: "1.1rem", marginBottom: 12 }}>Patient Bill Receipt</div>
        <hr style={{ border: "none", borderTop: "2px solid #e5e7eb", margin: "18px 0 24px 0" }} />
        <div style={{ display: "flex", gap: 48, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Patient Details</div>
            <div><strong>Name:</strong> {patient.name}</div>
            <div><strong>Age:</strong> {patient.age} {patient.age_type}</div>
            <div><strong>Gender:</strong> {patient.gender}</div>
            <div><strong>Mobile:</strong> {patient.mobile}</div>
            <div><strong>Email:</strong> {patient.email}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>Bill Information</div>
            <div><strong>Bill ID:</strong> #{patient.id}</div>
            <div><strong>Date:</strong> {new Date(patient.date).toLocaleDateString()}</div>
            <div><strong>Referred By:</strong> {patient.referrer}</div>
          </div>
        </div>
        <div style={{ fontWeight: 600, color: "#6b7280", marginTop: 18, marginBottom: 6 }}>Address</div>
        <div>{patient.address}</div>
        <div style={{ fontWeight: 600, color: "#6b7280", marginTop: 18, marginBottom: 6 }}>Tests Ordered</div>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#f7fbff",
          borderRadius: 8,
          overflow: "hidden",
          marginTop: 10
        }}>
          <thead>
            <tr>
              <th style={{ background: "#f1f5f9", color: "#2563eb", fontWeight: 600, padding: "12px 16px", textAlign: "left" }}>S.No</th>
              <th style={{ background: "#f1f5f9", color: "#2563eb", fontWeight: 600, padding: "12px 16px", textAlign: "left" }}>Test Name</th>
              <th style={{ background: "#f1f5f9", color: "#2563eb", fontWeight: 600, padding: "12px 16px", textAlign: "left" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, idx) => (
              <tr key={test.id}>
                <td style={{ padding: "12px 16px" }}>{idx + 1}</td>
                <td style={{ padding: "12px 16px" }}>{test.tests?.test_name || test.name}</td>
                <td style={{ padding: "12px 16px" }}>₹{parseFloat(test.price).toFixed(2)}</td>
              </tr>
            ))}
            {tests.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "#9aa4b2", padding: "12px" }}>No tests added</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold", background: "#f1f5f9" }}>Total Amount:</td>
              <td style={{ color: "#2563eb", fontWeight: "bold", background: "#f1f5f9" }}>₹{totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <button style={{ marginTop: 24 }} onClick={handlePrint}>Print Bill</button>
        <button style={{ marginTop: 12, marginLeft: 12 }} onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default PatientPreview;