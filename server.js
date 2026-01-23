const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Predefined 6 users
const users = [
  { username: "alice", password: "pass1" },
  { username: "bob", password: "pass2" },
  { username: "charlie", password: "pass3" },
  { username: "david", password: "pass4" },
  { username: "eve", password: "pass5" },
  { username: "frank", password: "pass6" }
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.json({ success: false, message: "Invalid credentials or not authorized" });
  }
});

app.post("/chat", (req, res) => {
  const { user, message } = req.body;
  let reply = `Hello ${user}, you said: ${message}`;
  res.json({ reply });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
