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
app.get("/", (req, res) => {
  res.render("login");
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
    Username: req.body.Username,
    password: req.body.password,
  };

  // Check if the username already exists in the database
  const existingUser = await collection.findOne({ name: data.Username });

  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    // Hash the password using bcrypt
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; // Replace the original password with the hashed one

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }

  FirstName = req.body.Fname;
  LastName = req.body.Lname;
  res.render("home", { Fname: req.body.Fname, Lname: req.body.Lname });
});

// Login user
app.post("/lhome", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("User name cannot found");
    }
    // Compare the hashed password from the database with the plaintext password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (!isPasswordMatch) {
      res.send("wrong Password");
    } else {
      FirstName = req.body.Fname;
      LastName = req.body.Lname;
      res.render("home", { Fname: req.body.Fname, Lname: req.body.Lname });
    }
  } catch {
    res.send("wrong Details");
  }
});

// Define Port for Application
const port = 5001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
