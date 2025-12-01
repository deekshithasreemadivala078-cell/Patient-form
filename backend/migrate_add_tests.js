// backend/migrate_add_tests.js
require("dotenv").config();
const mongoose = require("mongoose");
const Test = require("./models/Test");

const tests = [
  { test_name: "Blood Sugar (Fasting)", price: 250 },
  { test_name: "Complete Blood Count (CBC)", price: 400 },
  { test_name: "Lipid Profile", price: 600 },
  { test_name: "Thyroid Profile", price: 500 },
  { test_name: "Liver Function Test (LFT)", price: 700 },
  { test_name: "Kidney Function Test (KFT)", price: 650 },
  { test_name: "Urine Routine", price: 150 },
  { test_name: "Vitamin D", price: 800 },
  { test_name: "HbA1c", price: 350 }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Test.deleteMany({});
    await Test.insertMany(tests);
    console.log("Health tests added to database.");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Migration error:", err);
    mongoose.disconnect();
  });