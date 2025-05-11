chatInput.addEventListener("keydown", handleChatInput);
chatInput.addEventListener("input", () => {}); // Safari sometimes needs this to detect user input

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
      addMessage(data.response, "bot");
    } catch (err) {
      addMessage("⚠️ Error: Unable to reach chatbot.", "bot");
    }
  }
}
ext, sender) {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}
