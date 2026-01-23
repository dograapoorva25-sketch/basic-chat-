const socket = io();

/* =====================
   SCREEN ELEMENTS
===================== */
const authScreen = document.getElementById("auth-screen");
const passwordCard = document.getElementById("password-card");
const usernameCard = document.getElementById("username-card");
const chatScreen = document.getElementById("chat-screen");

/* =====================
   AUTH ELEMENTS
===================== */
const loginBtn = document.getElementById("login-btn");
const loginPass = document.getElementById("login-pass");

const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username");
const joinError = document.getElementById("join-error");

/* =====================
   CHAT ELEMENTS
===================== */
const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");
const usersList = document.getElementById("users");
const onlineCount = document.getElementById("online-count");

/* =====================
   PAGE 1 → PASSWORD
===================== */
loginBtn.onclick = () => {
  const pass = loginPass.value.trim();
  if (!pass) return;

  // simple front-end check (backend can also verify)
  if (pass === "1234") {
    passwordCard.classList.add("hidden");
    usernameCard.classList.remove("hidden");
  } else {
    alert("Wrong password");
  }
};

/* =====================
   PAGE 2 → USERNAME
===================== */
joinBtn.onclick = () => {
  const username = usernameInput.value.trim();
  if (!username) return;

  socket.emit("join", username);

  authScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
};

/* =====================
   SEND MESSAGE
===================== */
sendBtn.onclick = sendMessage;

messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const msg = messageInput.value.trim();
  if (!msg) return;

  socket.emit("message", msg);
  messageInput.value = "";
}

/* =====================
   RECEIVE MESSAGE
===================== */
socket.on("message", data => {
  addMessage(`${data.user}: ${data.text}`);
});

/* =====================
   MESSAGE HISTORY
===================== */
socket.on("message_history", messages => {
  messagesDiv.innerHTML = "";
  messages.forEach(msg => {
    addMessage(`${msg.username}: ${msg.text}`);
  });
});

/* =====================
   USER EVENTS
===================== */
socket.on("user_joined", username => {
  addSystemMessage(`${username} joined`);
});

socket.on("user_left", username => {
  addSystemMessage(`${username} left`);
});

/* =====================
   USERS LIST
===================== */
socket.on("users_list", users => {
  usersList.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    usersList.appendChild(li);
  });

  onlineCount.textContent = `${users.length} online`;
});

/* =====================
   ROOM FULL
===================== */
socket.on("room_full", msg => {
  joinError.textContent = msg;
});

/* =====================
   HELPERS
===================== */
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
}
