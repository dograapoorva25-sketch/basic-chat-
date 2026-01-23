// =====================
// IMPORTS
// =====================
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// =====================
// APP SETUP
// =====================
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// =====================
// STATIC FILES
// =====================
app.use(express.static("public")); 
// put index.html, style.css, script.js inside "public"

// =====================
// DATA STORAGE
// =====================
const users = new Map(); // socket.id -> username
const messages = [];    // message history
const MAX_USERS = 6;

// =====================
// SOCKET LOGIC
// =====================
io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // =====================
  // JOIN
  // =====================
  socket.on("join", username => {

    if (users.size >= MAX_USERS) {
      socket.emit("room_full", "Room is full (6 users max)");
      return;
    }

    // prevent duplicate usernames
    if ([...users.values()].includes(username)) {
      socket.emit("room_full", "Username already taken");
      return;
    }

    users.set(socket.id, username);

    // send history to new user
    socket.emit("message_history", messages);

    // notify others
    socket.broadcast.emit("user_joined", username);

    // update user list
    io.emit("users_list", [...users.values()]);
  });

  // =====================
  // MESSAGE
  // =====================
  socket.on("message", text => {
    const username = users.get(socket.id);
    if (!username) return;

    const msg = { username, text };
    messages.push(msg);

    // limit history (optional)
    if (messages.length > 100) messages.shift();

    io.emit("message", {
      user: username,
      text
    });
  });

  // =====================
  // DISCONNECT
  // =====================
  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    if (!username) return;

    users.delete(socket.id);

    socket.broadcast.emit("user_left", username);
    io.emit("users_list", [...users.values()]);

    console.log("User disconnected:", username);
  });
});

// =====================
// START SERVER
// =====================
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
