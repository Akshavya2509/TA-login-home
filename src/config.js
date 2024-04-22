const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/TA-Project");

// Check database connected or not
connect
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(() => {
    console.log("Database cannot be Connected");
  });

// Create Schema
const Loginschema = new mongoose.Schema({
  Fname: {
    type: String,
    required: true,
  },
  Lname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const feedbackSchema = new mongoose.Schema({
  Fname: {
    type: String,
    required: true,
  },
  Lname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  Rating: {
    type: Number,
    required: true,
  },
});

const collection = new mongoose.model("users", Loginschema);
const collection1 = new mongoose.model("feedback", feedbackSchema);

module.exports = { collection, collection1 };
