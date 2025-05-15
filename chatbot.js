let sessionId = localStorage.getItem("chat_session_id");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("chat_session_id", sessionId);
}

function showTypingIndicator() {
  const chatLog = document.getElementById("chat-log");
  const typingIndicator = document.createElement("div");
  typingIndicator.id = "typing-indicator";
  typingIndicator.className = "typing-indicator bot-row";
  typingIndicator.innerHTML = "<span>•</span><span>•</span><span>•</span>";
  chatLog.appendChild(typingIndicator);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}

async function sendMessage() {
  const inputBox = document.getElementById("chat-input");
  const message = inputBox.value.trim();

  if (!message) return;  // Avoid sending empty messages

  // Add user message to chat log
  appendMessage("user", message);

  // Clear input field
  inputBox.value = "";

  showTypingIndicator();
  
  try {
    // Send message to backend
    const response = await fetch("https://api.kairosoptions.ai/chat", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ session_id: sessionId,  prompt: message  })
    });

    const data = await response.json();
    removeTypingIndicator();
    // Add backend response to chat log
    appendMessage("bot", data.response);
  } catch (error) {
    removeTypingIndicator();
    console.error("Error sending message:", error);
    appendMessage("bot", "Chatbot in maintenance, please try again later.");
  }
}

function appendMessage(sender, messageText) {
  const chatLog = document.getElementById("chat-log");

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("message-row", sender === "user" ? "user-row" : "bot-row");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = messageText;

  rowDiv.appendChild(messageDiv);
  chatLog.appendChild(rowDiv);

  // Auto-scroll to the bottom
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Add event listeners for Enter and Shift-Enter functionality
document.getElementById("chat-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();  // Prevent default newline on Enter
    sendMessage();
  }
});

// Ensure chat stays scrolled when keyboard appears
document.getElementById('chat-input').addEventListener('focus', () => {
  setTimeout(() => {
    const chatLog = document.getElementById("chat-log");
    chatLog.scrollTop = chatLog.scrollHeight;
  }, 300);  // allow keyboard to settle first
});
