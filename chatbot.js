document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-button");
  const chatLog = document.getElementById("chat-log");

  // Send on Enter, newline on Shift+Enter
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendButton.addEventListener("click", sendMessage);

  async function sendMessage() {
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    chatInput.value = "";

    // Add user message
    const userRow = document.createElement("div");
    userRow.className = "message-row user-row";

    const userSpacer = document.createElement("div");
    userSpacer.className = "spacer";

    const userBubble = document.createElement("div");
    userBubble.className = "message user";
    userBubble.innerText = prompt;

    userRow.appendChild(userSpacer);
    userRow.appendChild(userBubble);
    chatLog.appendChild(userRow);

    // Add typing indicator
    const botRow = document.createElement("div");
    botRow.className = "message-row bot-row";

    const botBubble = document.createElement("div");
    botBubble.className = "message bot typing-indicator";
    botBubble.innerHTML = "<span>.</span><span>.</span><span>.</span>";

    botRow.appendChild(botBubble);
    chatLog.appendChild(botRow);
    chatLog.scrollTop = chatLog.scrollHeight;

    try {
      const res = await fetch("https://api.kairosoptions.ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("HTTP error " + res.status);

      const data = await res.json();

      // Replace typing indicator with real message
      botBubble.classList.remove("typing-indicator");
      botBubble.innerText = data.response || "[No reply]";
    } catch (err) {
      botBubble.classList.remove("typing-indicator");
      botBubble.innerText = "⚠️ Error: Unable to reach chatbot.";
      console.error(err);
    }

    chatLog.scrollTop = chatLog.scrollHeight;
  }
});
