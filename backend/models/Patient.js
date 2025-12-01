const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  age_type: String,
  gender: String,
  mobile: String,
  email: String,
  address: String,
  referrer: String,
  remarks: String,
  date: { type: Date, default: Date.now },
  total_amount: Number
});

module.exports = mongoose.model("Patient", PatientSchema);
