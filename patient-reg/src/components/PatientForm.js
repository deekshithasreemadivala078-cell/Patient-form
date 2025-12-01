// src/components/PatientForm.js
import React, { useState, useEffect } from 'react';
import api from '../api';

const emptyForm = {
  name: '',
  age: '',
  ageType: 'Years',
  gender: 'Male',
  mobile: '',
  email: '',
  address: '',
  referrer: '',
  remarks: '',
  priceList: '',
  tests: [], // { id, name, price }
};

export default function PatientForm({ initial, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [testsList, setTestsList] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    api.getTests().then(res => setTestsList(res.data || []));
  }, []);

  useEffect(() => {
    if (initial) {
      // map patient record to form (if any)
      setForm(prev => ({ ...prev, ...initial }));
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name required';
    if (!form.mobile.match(/^\d{10}$/)) e.mobile = 'Enter 10-digit mobile';
    // email optional but if provided, basic check
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addTest = (testId) => {
  const t = testsList.find(x => x._id === testId);
  if (!t) return;
  setForm(prev => ({ ...prev, tests: [...prev.tests, { ...t }] }));
};

  const removeTest = (idx) => {
    setForm(prev => {
      const copy = [...prev.tests];
      copy.splice(idx, 1);
      return { ...prev, tests: copy };
    });
  };

  const total = form.tests.reduce((s, t) => s + Number(t.price || 0), 0);

  const onSave = async (print = false) => {
    if (!validate()) return;
    const payload = {
      ...form,
      total,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await api.savePatient(payload);
      alert('Saved successfully');
      if (print) {
        // very simple print preview in new window
        const html = `<h1>Bill - ${res.data.name}</h1><p>Total: ${payload.total}</p>`;
        const w = window.open('', '_blank');
        w.document.write(html);
        w.print();
      }
      onSaved && onSaved();
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  return (
    <div className="form-wrap">
      <section className="patient-details card">
        <h4>Patient Details</h4>
        <div className="row">
          <label>
            Full Name *
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            {errors.name && <div className="err">{errors.name}</div>}
          </label>

          <label>
            Age *
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value.replace(/\D/g,'') })} />
              <select value={form.ageType} onChange={e => setForm({ ...form, ageType: e.target.value })}>
                <option>Years</option>
                <option>Months</option>
                <option>Days</option>
              </select>
            </div>
          </label>

          <label>
            Gender *
            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
          </label>
        </div>

        <div className="row">
          <label>
            Mobile *
            <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g,'').slice(0,10) })} />
            {errors.mobile && <div className="err">{errors.mobile}</div>}
          </label>

          <label>
            Email (Optional)
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            {errors.email && <div className="err">{errors.email}</div>}
          </label>
        </div>

        <div className="row">
          <label style={{ flex: 1 }}>
            Address
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </label>
        </div>

        <div className="row">
          <label>
            Referrer
            <input value={form.referrer} onChange={e => setForm({ ...form, referrer: e.target.value })} />
          </label>

          <label style={{ flex: 1 }}>
            Remarks
            <input value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
          </label>

          <label>
            Price List
            <select value={form.priceList} onChange={e => setForm({ ...form, priceList: e.target.value })}>
              <option value="">Select</option>
              <option value="standard">Standard</option>
              <option value="discount">Discount</option>
            </select>
          </label>
        </div>
      </section>

      <section className="tests card">
        <h4>Tests</h4>
        <div className="add-test">
         <select onChange={e => addTest(e.target.value)}>
  <option value="">-- Add test --</option>
  {testsList.map(t => <option value={t._id} key={t._id}>{t.test_name} — {t.price}</option>)}
</select>
          <button onClick={() => setForm(emptyForm)} className="btn-small">Clear Form</button>
        </div>

        <table className="tests-table">
          <thead>
            <tr><th>Test Name</th><th>Price</th><th>Action</th></tr>
          </thead>
          <tbody>
           {form.tests.map((t, idx) => (
  <tr key={idx}>
    <td>{t.test_name}</td>
    <td>{t.price}</td>
    <td><button className="btn-small" onClick={() => removeTest(idx)}>Remove</button></td>
  </tr>
))}
            {form.tests.length === 0 && <tr><td colSpan="3" className="muted">No tests added</td></tr>}
          </tbody>
        </table>

        <div className="total-row">
          <div>Total:</div>
          <div><strong>₹ {total}</strong></div>
        </div>

        <div className="right-actions">
          <button className="btn-primary" onClick={() => onSave(false)}>Save</button>
          {/* <button className="btn-primary outline" onClick={() => onSave(true)}>Save & Print Bill</button> */}
          <button className="btn" onClick={() => setPreviewOpen(true)}>Preview</button>
          <button className="btn" onClick={() => window.print()}>Print Multiple</button>
          <button className="btn-danger" onClick={() => setForm(emptyForm)}>Cancel Test</button>
        </div>
      </section>

      {previewOpen && (
        <div className="preview-modal">
          <div className="preview-card" style={{maxWidth:600,margin:'0 auto',background:'#fff',padding:32,borderRadius:8}}>
            <h2 style={{textAlign:'center',color:'#2563eb',marginBottom:0}}>Delight Diagnostics</h2>
            <div style={{textAlign:'center',color:'#666',marginBottom:16}}>Patient Bill Receipt</div>
            <hr />
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
              <div>
                <div style={{fontWeight:'bold',color:'#666'}}>Patient Details</div>
                <div><b>Name:</b> {form.name}</div>
                <div><b>Age:</b> {form.age} {form.ageType && `year(s)`}</div>
                <div><b>Gender:</b> {form.gender}</div>
                <div><b>Mobile:</b> {form.mobile}</div>
                <div><b>Email:</b> {form.email}</div>
                <div style={{marginTop:8,fontWeight:'bold',color:'#666'}}>Address</div>
                <div>{form.address}</div>
              </div>
              <div>
                <div style={{fontWeight:'bold',color:'#666'}}>Bill Information</div>
                <div><b>Bill ID:</b> #1</div>
                <div><b>Date:</b> {new Date().toLocaleDateString()}</div>
                <div><b>Referred By:</b> {form.referrer}</div>
              </div>
            </div>
            <div style={{fontWeight:'bold',color:'#666',marginBottom:8}}>Tests Ordered</div>
            <table style={{width:'100%',borderCollapse:'collapse',marginBottom:16}}>
              <thead>
                <tr style={{background:'#f3f4f6'}}>
                  <th style={{padding:8,textAlign:'left',border:'1px solid #e5e7eb'}}>S.No</th>
                  <th style={{padding:8,textAlign:'left',border:'1px solid #e5e7eb'}}>Test Name</th>
                  <th style={{padding:8,textAlign:'right',border:'1px solid #e5e7eb'}}>Price</th>
                </tr>
              </thead>
              <tbody>
                {form.tests.map((t, idx) => (
                  <tr key={idx}>
                    <td style={{padding:8,border:'1px solid #e5e7eb'}}>{idx+1}</td>
                    <td style={{padding:8,border:'1px solid #e5e7eb'}}>{t.name}</td>
                    <td style={{padding:8,border:'1px solid #e5e7eb',textAlign:'right'}}>₹{t.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{textAlign:'right',fontWeight:'bold',fontSize:18}}>Total Amount: <span style={{color:'#2563eb'}}>₹{form.tests.reduce((s,t)=>s+Number(t.price||0),0).toFixed(2)}</span></div>
            <button onClick={() => setPreviewOpen(false)} className="btn" style={{marginTop:24}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
