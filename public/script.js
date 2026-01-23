document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("sendBtn").addEventListener("click", sendMessage);

let currentUser = null;

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  const msg = document.getElementById("loginMsg");

  if (data.success) {
    currentUser = username;
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("chatbox").style.display = "block";
  } else {
    msg.textContent = data.message;
  }
}

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  displayMessage(currentUser, text, "user");

  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: currentUser, message: text })
  });

  const data = await response.json();
  displayMessage("Server", data.reply, "server");

  input.value = "";
}

function displayMessage(sender, text, type) {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = sender + ": " + text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
