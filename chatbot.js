document.addEventListener("DOMContentLoaded", () => {
  const chatLog = document.getElementById("chat-log");
  const chatInput = document.getElementById("chat-input");

  chatInput.addEventListener("keydown", handleChatInput);

  // Optional: ensure Safari registers input field activity
  chatInput.addEventListener("input", () => {});

  async function handleChatInput(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const prompt = chatInput.value.trim();
      if (!prompt) return;

      addMessage(prompt, "user");
      chatInput.value = "";

      try {
        const response = await fetch("https://api.kairosoptions.ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        addMessage(data.response || "⚠️ No response received.", "bot");
      } catch (err) {
        addMessage("⚠️ Error: Unable to reach chatbot.", "bot");
        console.error("[chatbot] fetch failed:", err);
      }
    }
  }

  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.classList.add("chat-message", sender);
    message.textContent = text;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight; // auto-scroll to bottom
  }
});
