const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  test_name: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model("Test", TestSchema);
