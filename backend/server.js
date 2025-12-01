require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Patient = require("./models/Patient");
const Test = require("./models/Test");
const PatientTest = require("./models/PatientTest");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------------------
// DELETE PATIENT AND ASSOCIATED TESTS
app.delete("/api/patients/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    // Remove patient
    const patient = await Patient.findByIdAndDelete(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    // Remove associated PatientTest records
    await PatientTest.deleteMany({ patient_id: patientId });
    res.json({ success: true, message: "Patient and associated tests deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// CONNECT TO MONGODB
// -------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


// -------------------------------
// GET TEST LIST
// -------------------------------
app.get("/api/tests", async (req, res) => {
  const tests = await Test.find({});
  res.json({ success: true, data: tests });
});


// -------------------------------
// SAVE PATIENT + TEST MAPPING
// -------------------------------
app.post("/api/patients", async (req, res) => {
  try {
    const { name, age, age_type, gender, mobile, email, address, referrer, remarks, total_amount, tests } = req.body;

    // Save patient
    const patient = await Patient.create({
      name,
      age,
      age_type,
      gender,
      mobile,
      email,
      address,
      referrer,
      remarks,
      total_amount
    });

    // Save mapping in patient_tests collection
    for (const t of tests) {
      await PatientTest.create({
        patient_id: patient._id,
        test_id: t.id,
        price: t.price
      });
    }

    res.json({ success: true, patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// -------------------------------
// GET PATIENTS BY DATE
// -------------------------------
app.get("/api/patients", async (req, res) => {
  const { date } = req.query;

  if (date) {
    const start = new Date(`${date}T00:00:00Z`);
    const end = new Date(`${date}T23:59:59Z`);

    const patients = await Patient.find({
      date: { $gte: start, $lte: end }
    });
    return res.json({ success: true, data: patients });
  }

  const all = await Patient.find().sort({ date: -1 });
  res.json({ success: true, data: all });
});


// -------------------------------
// GET PATIENT DETAILS + TESTS
// -------------------------------
app.get("/api/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient)
      return res.status(404).json({ success: false, message: "Not Found" });

    const tests = await PatientTest.find({ patient_id: req.params.id })
      .populate("test_id");

    res.json({
      success: true,
      patient,
      tests
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});


// -------------------------------
app.listen(5000, () =>
  console.log("MongoDB backend running at http://localhost:5000")
);
