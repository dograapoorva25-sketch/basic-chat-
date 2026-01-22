const correctPassword = "chatbox7"; 
let user = "";

function login() {
  const name = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;

  if (!name) {
    alert("Please enter your name");
    return;
  }
  if (pass !== correctPassword) {
    alert("Incorrect password!");
    return;
  }

  user = name;
  document.getElementById("login").style.display = "none";
  document.getElementById("chatroom").style.display = "block";
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  const msgBox = document.createElement("div");
  msgBox.className = "msg";
  msgBox.textContent = user + ": " + text;

  document.getElementById("messages").appendChild(msgBox);
  input.value = "";
  input.focus();
}
