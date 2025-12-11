import React, { useState } from 'react';
import {  FileText, Settings, Bell, Search, ChevronDown, Plus, X, Save, Printer, Clock, DollarSign, Menu,  TestTube, Mail, Phone, Calendar, UserCircle, AlertCircle } from 'lucide-react';

export default function LabManagementSystem() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTests, setSelectedTests] = useState([
    { id: 1, name: 'Complete Blood Count (CBC)', price: 500 },
    { id: 2, name: 'Lipid Profile', price: 750 }
  ]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    ageType: 'Years',
    gender: 'Male',
    mobile: '',
    email: '',
    alternateId: '',
    referrer: '',
    address: '',
    remarks: '',
    priceList: 'Standard'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showChangePrice, setShowChangePrice] = useState(false);
  const [showSpecimenTime, setShowSpecimenTime] = useState(false);
  const [showReportFindings, setShowReportFindings] = useState(false);
  const [priceEdit, setPriceEdit] = useState({});
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState('');
  const [specimenTime, setSpecimenTime] = useState('');
  const [findings, setFindings] = useState('');

  const patients = [
    { id: 'DD2511-0001', name: 'John Doe', date: '2025-11-29', status: 'active' },
    { id: 'DD2511-0006', name: 'Sarah Wilson', date: '2025-11-27', status: 'active' },
    { id: 'DD2511-0005', name: 'Sarah Wilson', date: '2025-11-27', status: 'active' },
    { id: 'DD2511-0004', name: 'Sarah Wilson', date: '2025-11-27', status: 'active' },
    { id: 'DD2511-0002', name: 'Jane Smith', date: '2025-11-29', status: 'pending' },
    { id: 'DD2511-0003', name: 'Mike Johnson', date: '2025-11-28', status: 'completed' },
    { id: 'DD2511-0007', name: 'Sarah Wilson', date: '2025-11-27', status: 'active' }
  ];

  const availableTests = [
    { id: 3, name: 'Thyroid Function Test', price: 600 },
    { id: 4, name: 'Blood Glucose', price: 200 },
    { id: 5, name: 'Liver Function Test', price: 800 },
    { id: 6, name: 'Kidney Function Test', price: 700 },
    { id: 7, name: 'HbA1c Test', price: 450 }
  ];

  const priceLists = ['Standard', 'Corporate', 'Insurance', 'VIP'];

  let filteredPatients = patients;
  if (searchDate) {
    filteredPatients = filteredPatients.filter(p => p.date === searchDate);
  }
  if (searchTerm.trim()) {
    filteredPatients = filteredPatients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (selectedTests.length === 0) {
      newErrors.tests = 'At least one test must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeTest = (id) => {
    setSelectedTests(selectedTests.filter(test => test.id !== id));
    if (errors.tests) {
      setErrors(prev => ({ ...prev, tests: '' }));
    }
  };

  const addTest = (test) => {
    if (!selectedTests.find(t => t.id === test.id)) {
      setSelectedTests([...selectedTests, test]);
      if (errors.tests) {
        setErrors(prev => ({ ...prev, tests: '' }));
      }
    }
  };

  const totalAmount = selectedTests.reduce((sum, test) => sum + test.price, 0);

  const handleSave = () => {
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setShowSaveSuccess(true);
        setLoading(false);
        setTimeout(() => setShowSaveSuccess(false), 3000);
      }, 1000);
      console.log('Saving patient data:', { ...formData, tests: selectedTests, totalAmount });
    }
  };

  const handleCancelTest = () => {
    if (window.confirm('Are you sure you want to cancel all tests?')) {
      setSelectedTests([]);
    }
  };

  const handleChangePrice = (testId, newPrice) => {
    setPriceLoading(true);
    setTimeout(() => {
      setSelectedTests(prev =>
        prev.map(test =>
          test.id === testId ? { ...test, price: newPrice } : test
        )
      );
      setPriceEdit(prev => ({ ...prev, [testId]: undefined }));
      setPriceLoading(false);
    }, 1000);
  };

  const handleSetSpecimenTime = (time) => {
    setSpecimenTime(time);
    setShowSpecimenTime(false);
  };

  const handleSetFindings = (findings) => {
    setFindings(findings);
    setShowReportFindings(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ backgroundColor: '#F5F7FB' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D6CDF 0%, #0AB39C 100%)' }}>
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>LabPro</h1>
                <p className="text-xs text-gray-500">Laboratory Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients, tests..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-64"
                style={{ focusRingColor: '#2D6CDF' }}
              />
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'linear-gradient(135deg, #2D6CDF 0%, #0AB39C 100%)' }}>
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - fixed and scrollable */}
        <aside
          className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen z-40`}
          style={{ overflowY: 'auto', minWidth: sidebarOpen ? '320px' : '0', boxShadow: sidebarOpen ? '2px 0 8px rgba(0,0,0,0.04)' : 'none', paddingTop: '80px' }}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: '#1A1A1A' }}>Recent Patients</h2>
               <button className="text-sm font-medium" style={{ color: '#2D6CDF' }} onClick={() => { /* TODO: implement view all patients */ }}>
                View All
              </button>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  style={{ focusRingColor: '#2D6CDF' }}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  style={{ focusRingColor: '#2D6CDF' }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-all group"
                style={{ ':hover': { borderColor: '#2D6CDF', backgroundColor: '#EEF2FF' } }}
                onClick={() => { /* TODO: implement patient selection */ }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2D6CDF 0%, #0AB39C 100%)' }}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate" style={{ color: '#1A1A1A' }}>{patient.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        patient.status === 'active' ? 'text-white' :
                        patient.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`} style={patient.status === 'active' ? { backgroundColor: '#0AB39C' } : {}}>
                        {patient.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{patient.id}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-600">{new Date(patient.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No patients found for selected date
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ marginLeft: sidebarOpen ? '320px' : '0' }}>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Success Toast */}
            {showSaveSuccess && (
              <div className="fixed top-20 right-6 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top z-50" style={{ backgroundColor: '#0AB39C' }}>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm" style={{ color: '#0AB39C' }}>✓</span>
                </div>
                <span className="font-medium">Patient details saved successfully!</span>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="fixed top-20 right-6 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top z-50" style={{ backgroundColor: '#2D6CDF' }}>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" /></svg>
                <span className="font-medium">Saving...</span>
              </div>
            )}

            {/* Error Display */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-900 mb-1">Please fix the following errors:</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {Object.values(errors).map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="cursor-pointer" style={{ ':hover': { color: '#2D6CDF' } }}>Patients</span>
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              <span className="font-medium" style={{ color: '#1A1A1A' }}>DD2511-0001</span>
            </div>

            {/* Patient Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #2D6CDF 0%, #0AB39C 100%)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-8 h-8 text-white" />
                    <div>
                      <h2 className="text-xl font-semibold text-white">Patient Information</h2>
                      <p className="text-white text-sm opacity-90">ID: DD2511-0001</p>
                    </div>
                  </div>
                  <span className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Active Patient
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Patient Name *</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Age</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Age"
                        min="0"
                        max="130"
                        value={formData.age}
                        onChange={e => handleInputChange('age', e.target.value)}
                        onBlur={e => {
                          let val = e.target.value;
                          if (val === '' || isNaN(Number(val))) return;
                          let num = Number(val);
                          if (num < 0) handleInputChange('age', '0');
                          else if (num > 130) handleInputChange('age', '130');
                        }}
                        className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ minWidth: 0 }}
                      />
                      <select 
                        value={formData.ageType}
                        onChange={(e) => handleInputChange('ageType', e.target.value)}
                        className="w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                        style={{ minWidth: 0 }}
                      >
                        <option>Years</option>
                        <option>Months</option>
                        <option>Days</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Gender *</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Mobile Number *</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 00000 00000"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Email Address</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Alternate ID</label>
                    <input
                      type="text"
                      placeholder="Enter alternate ID"
                      value={formData.alternateId}
                      onChange={(e) => handleInputChange('alternateId', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Referrer</label>
                    <input
                      type="text"
                      placeholder="Referring doctor/hospital"
                      value={formData.referrer}
                      onChange={(e) => handleInputChange('referrer', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Address</label>
                    <input
                      type="text"
                      placeholder="Patient address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Price List</label>
                    <select 
                      value={formData.priceList}
                      onChange={(e) => handleInputChange('priceList', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                    >
                      {priceLists.map(list => (
                        <option key={list}>{list}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Remarks</label>
                  <textarea
                    rows="2"
                    placeholder="Additional notes or remarks"
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>


            {/* Test Selection Card & Action Buttons Side by Side */}
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              {/* Test Selection Card */}
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #0AB39C 0%, #2D6CDF 100%)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TestTube className="w-7 h-7 text-white" />
                      <div>
                        <h2 className="text-xl font-semibold text-white">Test Selection</h2>
                        <p className="text-white text-sm opacity-90">Select and manage laboratory tests</p>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                      <span className="text-sm font-medium">{selectedTests.length} Tests Selected</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>Add Tests</label>
                    <div className="flex gap-2">
                      <select 
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                        onChange={(e) => {
                          const testId = parseInt(e.target.value);
                          if (testId) {
                            const test = availableTests.find(t => t.id === testId);
                            if (test) addTest(test);
                            e.target.value = '';
                          }
                        }}
                      >
                        <option value="">Select a test...</option>
                        {availableTests.map(test => (
                          <option key={test.id} value={test.id}>{test.name} - ₹{test.price}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => {
                          const randomTest = availableTests[Math.floor(Math.random() * availableTests.length)];
                          addTest(randomTest);
                        }}
                        className="px-6 py-2.5 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                        style={{ backgroundColor: '#2D6CDF', ':hover': { backgroundColor: '#1e5bcc' } }}
                      >
                        <Plus className="w-5 h-5" />
                        Add Test
                      </button>
                    </div>
                    {errors.tests && (
                      <p className="text-red-600 text-sm mt-1">{errors.tests}</p>
                    )}
                  </div>
                  {selectedTests.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="font-medium mb-3" style={{ color: '#1A1A1A' }}>Selected Tests</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#1A1A1A' }}>Test Name</th>
                              <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: '#1A1A1A' }}>Price</th>
                              <th className="text-center px-4 py-3 text-sm font-medium" style={{ color: '#1A1A1A' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {selectedTests.map((test) => (
                              <tr key={test.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0AB39C 0%, #2D6CDF 100%)' }}>
                                      <TestTube className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{test.name}</h4>
                                      <p className="text-xs text-gray-500">Test ID: T{test.id.toString().padStart(4, '0')}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>₹{test.price}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => removeTest(test.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200 mt-4">
                        <span className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>Total Amount</span>
                        <span className="text-3xl font-bold" style={{ color: '#2D6CDF' }}>₹{totalAmount}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                      <TestTube className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No tests selected yet</p>
                      <p className="text-sm text-gray-400 mt-1">Add tests from the dropdown above</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="w-full lg:w-[420px] flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[320px]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium" onClick={() => setShowSpecimenTime(true)}>
                      <Clock className="w-4 h-4" />
                      Set Specimen Time
                    </button>
                    <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium" onClick={() => setShowChangePrice(true)}>
                      <DollarSign className="w-4 h-4" />
                      Change Price
                    </button>
                    <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium" onClick={() => setShowReportFindings(true)}>
                      <FileText className="w-4 h-4" />
                      Report/Findings
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={handleCancelTest}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel Test
                    </button>
                    <button className="px-6 py-2.5 border text-white rounded-lg transition-colors flex items-center gap-2 font-medium" style={{ backgroundColor: '#2D6CDF', borderColor: '#2D6CDF' }} onClick={() => setShowPreview(true)}>
                      <Printer className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium" onClick={() => window.print()}>
                      <Printer className="w-4 h-4" />
                      Print Multiple
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2.5 text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-lg"
                      style={{ background: 'linear-gradient(90deg, #2D6CDF 0%, #0AB39C 100%)' }}
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button 
                      onClick={() => { handleSave(); setTimeout(() => setShowPreview(true), 1600); }}
                      className="px-6 py-2.5 text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-lg"
                      style={{ background: 'linear-gradient(90deg, #0AB39C 0%, #2D6CDF 100%)' }}
                    >
                      <Printer className="w-4 h-4" />
                      Save & Print Bill
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowPreview(false)}><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold mb-4">Preview Bill</h2>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Patient: {formData.name || 'N/A'}</h3>
              <p className="text-sm text-gray-500 mb-2">Mobile: {formData.mobile || 'N/A'}</p>
              <p className="text-sm text-gray-500 mb-2">Total Amount: ₹{totalAmount}</p>
            </div>
            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th className="text-left">Test Name</th>
                  <th className="text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedTests.map(test => (
                  <tr key={test.id}>
                    <td>{test.name}</td>
                    <td className="text-right">₹{test.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium" onClick={() => { setShowPreview(false); window.print(); }}>Print Bill</button>
          </div>
        </div>
      )}
      {showChangePrice && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowChangePrice(false)}><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold mb-4">Change Test Price</h2>
            <div className="space-y-4">
              {selectedTests.map(test => (
                <div key={test.id} className="flex items-center gap-3">
                  <span className="flex-1">{test.name}</span>
                  <input
                    type="number"
                    min="1"
                    className="w-24 px-2 py-1 border rounded"
                    value={priceEdit[test.id] !== undefined ? priceEdit[test.id] : test.price}
                    onChange={e => setPriceEdit(prev => ({ ...prev, [test.id]: e.target.value }))}
                  />
                  <button className="px-3 py-1 bg-green-600 text-white rounded" disabled={priceLoading} onClick={() => handleChangePrice(test.id, priceEdit[test.id] !== undefined ? priceEdit[test.id] : test.price)}>
                    Save
                  </button>
                </div>
              ))}
            </div>
            {priceError && <p className="text-red-600 mt-2">{priceError}</p>}
            {priceLoading && <p className="text-blue-600 mt-2">Updating...</p>}
          </div>
        </div>
      )}
      {showSpecimenTime && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowSpecimenTime(false)}><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold mb-4">Set Specimen Collection Time</h2>
            <input
              type="datetime-local"
              className="w-full px-4 py-2 border rounded mb-4"
              value={specimenTime}
              onChange={e => setSpecimenTime(e.target.value)}
            />
            <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium" onClick={() => handleSetSpecimenTime(specimenTime)}>Save Time</button>
          </div>
        </div>
      )}
      {showReportFindings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setShowReportFindings(false)}><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold mb-4">Report / Findings</h2>
            <textarea
              rows="5"
              className="w-full px-4 py-2 border rounded mb-4"
              value={findings}
              onChange={e => setFindings(e.target.value)}
            />
            <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium" onClick={() => handleSetFindings(findings)}>Save Findings</button>
          </div>
        </div>
      )}
    </div>
  );
}