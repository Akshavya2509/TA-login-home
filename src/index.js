const express = require("express");
const path = require("path");
const { collection } = require("./config");
const bcrypt = require("bcrypt");
const { collection1 } = require("./config");

const app = express();
// convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Static file
app.use(express.static("public"));

//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const val = await collection.find();
  console.log(val);
  res.render("login");
});
app.get("/favicon", (req, res) => {
  res.render("google-gemini-icon.png");
});
app.get("/capture", (req, res) => {
  res.render("capture", { id: req.query.id });
});
app.get("/feedback", async (req, res) => {
  res.render("feedback", { id: req.query.id });
});
app.post("/submitFeedback", async (req, res) => {
  try {
    console.log(req.body.id);
    const existingUser = await collection.findById(req.body.id);
    console.log(existingUser);

    const feedback = await collection1.create({
      Fname: existingUser.Fname,
      Lname: existingUser.Lname,
      username: existingUser.username,
      Rating: req.body.ans,
    });

    console.log(feedback);

    res.status(200).send("Feedback submitted successfully");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/feedback-page", async (req, res) => {
  res.render("feedback-page", { id: req.query.id });
});
app.get("/fetchFeedback", async (req, res) => {
  const { id } = req.query;
  const existingUser = await collection.findById(id);
  const feedbacks = await collection1.find({
    username: existingUser.username,
  });
  res.send(feedbacks);
});
// app.post("/fetchFeedback", async (req, res) => {
//   const { id } = req.body.id;
//     const existingUser = await collection.findById({ id });
//     const feedbacks = await collection1
//       .find({ username: existingUser.username })
//       .toArray();
//     console.log(feedbacks);
//     res.render("allUserFeedbacks", { feedbacks });
// })
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/homePage", async (req, res) => {
  const { id } = req.query;
  const existingUser = await collection.findById(id);

  res.render("home", {
    Fname: existingUser.Fname,
    Lname: existingUser.Lname,
    _id: id,
  });
});
// Register User
app.post("/shome", async (req, res) => {
  const data = {
    Fname: req.body.Fname,
    Lname: req.body.Lname,
    username: req.body.username,
    password: req.body.password,
  };

  // Check if the username already exists in the database
  const existingUser = await collection.findOne({ username: data.username });
  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    // Hash the password using bcrypt
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    console.log(data.password);
    data.password = hashedPassword; // Replace the original password with the hashed one
    console.log(data.password);
    console.log(data);
    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
  const user = await collection.findOne({ Fname: req.body.Fname });
  FirstName = req.body.Fname;
  LastName = req.body.Lname;
  res.render("home", {
    Fname: req.body.Fname,
    Lname: req.body.Lname,
    _id: user._id,
  });
});

// Login user
// Login user
app.post("/lhome", async (req, res) => {
  try {
    console.log(req.body);
    const user = await collection.findOne({
      username: req.body.username,
    });
    const doc = await collection.find();
    console.log("Document is\n" + doc);
    console.log(user);
    if (!user) {
      res.send("User not found.");
      return;
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      res.send("Incorrect password.");
      return;
    }

    FirstName = user.Fname;
    LastName = user.Lname;
    res.render("home", { Fname: user.Fname, Lname: user.Lname, _id: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res.send("Error logging in.");
  }
});

// Define Port for Application
const port = 5001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
