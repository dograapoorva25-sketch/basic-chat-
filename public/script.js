// ======================
// SOCKET CONNECTION (POLLING ONLY)
// ======================
const socket = io({
  upgrade: false
});

console.log("Client script loaded");

// ======================
// ELEMENTS
// ======================
const joinContainer = document.getElementById("join-container");
const chatContainer = document.getElementById("chat-container");

const joinBtn = document.getElementById("join-btn");
const sendBtn = document.getElementById("send-btn");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const messageInput = document.getElementById("message-input");

const messagesDiv = document.getElementById("messages");
const usersDiv = document.getElementById("users");
const joinError = document.getElementById("join-error");

// ======================
// JOIN CHAT
// ======================
joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    joinError.textContent = "❌ Username & password required";
    return;
  }

  joinError.textContent = "⏳ Connecting...";
  socket.emit("join", { username, password });
});

// ======================
// SERVER RESPONSES
// ======================
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("auth_error", msg => {
  joinError.textContent = "❌ " + msg;
});

socket.on("room_full", msg => {
  joinError.textContent = msg;
});

socket.on("connect_error", err => {
  joinError.textContent = "Connection error: " + err.message;
});

// ======================
// ✅ LOGIN SUCCESS → NEXT PAGE
// ======================
socket.on("message_history", history => {
  // save data for next page
  sessionStorage.setItem("username", usernameInput.value.trim());
  sessionStorage.setItem("history", JSON.stringify(history));

  // redirect to chat page
  window.location.href = "/chat.html";
});

// ======================
// SEND MESSAGE
// ======================
sendBtn?.addEventListener("click", sendMessage);
messageInput?.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const msg = messageInput.value.trim();
  if (!msg) return;

  socket.emit("message", msg);
  messageInput.value = "";
}

// ======================
// RECEIVE EVENTS
// ======================
socket.on("message", data => {
  addMessage(`${data.user}: ${data.text}`);
});

socket.on("user_joined", username => {
  addSystemMessage(`${username} joined`);
});

socket.on("user_left", username => {
  addSystemMessage(`${username} left`);
});

socket.on("users_list", users => {
  usersDiv.textContent = `Users (${users.length}/6): ${users.join(", ")}`;
});

// ======================
// HELPERS
// ======================
function addMessage(text) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSystemMessage(text) {
  const div = document.createElement("div");
  div.className = "message system";
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
