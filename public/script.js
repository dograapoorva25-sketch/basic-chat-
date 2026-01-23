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

body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#login, #chatroom {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  width: 300px;
}

#chatroom { display: none; }

input {
  width: 80%;
  padding:8px;
  margin: 6px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 80%;
  padding: 10px;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover { background: #0056b3; }

#messages {
  border: 1px solid #ccc;
  height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 5px;
}

.msg {
  margin: 5px 0;
  padding: 5px;
  background: #e9ecef;
  border-radius: 4px;
}
