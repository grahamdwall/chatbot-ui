document.addEventListener("DOMContentLoaded", function () {
  const inputBox = document.getElementById("chat-input");
  const chatLog = document.getElementById("chat-log");

  inputBox.addEventListener("keydown", async function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const prompt = inputBox.value.trim();
      if (prompt === "") return;

      appendMessage(prompt, "user");
      inputBox.value = "";

      try {
        const res = await fetch("https://api.kairosoptions.ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        appendMessage(data.response || "⚠️ No response", "bot");
      } catch (err) {
        appendMessage("⚠️ Error: Unable to reach chatbot.", "bot");
        console.error(err);
      }
    }
  });

  function appendMessage(text, sender) {
    const row = document.createElement("div");
    row.className = `message-row ${sender}-row`;

    const bubble = document.createElement("div");
    bubble.className = `message ${sender}`;
    bubble.textContent = text;

    const spacer = document.createElement("div");
    spacer.className = "spacer";

    if (sender === "user") {
      row.appendChild(spacer);     // Indent from left
      row.appendChild(bubble);     // User bubble on right
    } else {
      row.appendChild(bubble);     // Bot bubble on left
      row.appendChild(spacer);     // Indent from right
    }

    chatLog.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  appendMessage("user", text);
  input.value = "";

  // Show typing indicator
  const indicator = document.createElement("div");
  indicator.className = "message bot typing-indicator";
  indicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
  document.getElementById("chat-log").appendChild(indicator);

  try {
    const res = await fetch("https://api.kairosoptions.ai/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({prompt: text}),
    });
    const data = await res.json();

    indicator.remove(); // remove typing indicator
    appendMessage("bot", data.response);
  } catch (err) {
    indicator.remove();
    appendMessage("bot", "⚠️ Error: Unable to reach chatbot.");
  }
}
