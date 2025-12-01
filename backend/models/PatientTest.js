const mongoose = require('mongoose');
const PatientTestSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  test_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  price: { type: Number, required: true }
});
module.exports = mongoose.model('PatientTest', PatientTestSchema);
