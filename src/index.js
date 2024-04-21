const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require("bcrypt");

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

let FirstName = "",
  LastName = "";
app.get("/", async (req, res) => {
  const val = await collection.find();
  console.log(val);
  res.render("login");
});
app.get("/favicon", (req, res) => {
  res.render("views/google-gemini-icon.png");
});
app.get("/capture", (req, res) => {
  res.render("capture");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/homePage", (req, res) => {
  res.render("home", { Fname: FirstName, Lname: LastName });
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

  FirstName = req.body.Fname;
  LastName = req.body.Lname;
  res.render("home", { Fname: req.body.Fname, Lname: req.body.Lname });
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
    res.render("home", { Fname: user.Fname, Lname: user.Lname });
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
