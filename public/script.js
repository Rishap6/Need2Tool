const startBtn = document.getElementById("startBtn");
const landingPage = document.getElementById("landingPage");
const toolPage = document.getElementById("toolPage");
const generateBtn = document.getElementById("generateBtn");
const suggestBtn = document.getElementById("suggestBtn");
const copyPromptBtn = document.getElementById("copyPromptBtn"); // ✅ New
const userNeed = document.getElementById("userNeed");
const toolCode = document.getElementById("toolCode");
const livePreview = document.getElementById("livePreview");
const copyBtn = document.getElementById("copyBtn");

startBtn.addEventListener("click", () => {
  landingPage.classList.add("hidden");
  setTimeout(() => {
    toolPage.classList.remove("hidden");
  }, 400); // Give enough time for fade out
});


generateBtn.addEventListener("click", async () => {
  const need = userNeed.value.trim();
  if (!need) return alert("Please describe your need.");

  toolCode.textContent = "⚙️ Generating your tool...";
  livePreview.srcdoc = "";

  try {
    const res = await fetch("https://need2tool.onrender.com/generate-tool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ need })
    });

    const data = await res.json();

    if (data.code && data.code.includes("<html")) {
      toolCode.textContent = data.code;
      livePreview.srcdoc = data.code;
    } else {
      toolCode.textContent = "⚠️ Failed to generate a full tool.";
      livePreview.srcdoc = "<p style='padding: 1rem;'>No tool generated.</p>";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    toolCode.textContent = "❌ Failed to connect to backend.";
    livePreview.srcdoc = "<p style='padding: 1rem; color: red;'>Error connecting to server.</p>";
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(toolCode.textContent)
    .then(() => alert("✅ Copied to clipboard!"))
    .catch(() => alert("❌ Failed to copy."));
});

suggestBtn.addEventListener("click", async () => {
  userNeed.placeholder = "🧠 Thinking of a cool idea...";

  try {
    const res = await fetch("https://need2tool.onrender.com/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (data.idea) {
      userNeed.value = data.idea;
      userNeed.placeholder = "Here's a cool idea!";
    } else {
      userNeed.placeholder = "⚠️ Failed to fetch idea.";
    }
  } catch (err) {
    console.error("Suggestion fetch error:", err);
    userNeed.placeholder = "❌ Error connecting to AI.";
  }
});

copyPromptBtn.addEventListener("click", () => {
  const prompt = userNeed.value.trim();
  if (!prompt) return alert("There's no prompt to copy!");

  navigator.clipboard.writeText(prompt)
    .then(() => alert("📋 Prompt copied!"))
    .catch(() => alert("❌ Failed to copy prompt."));
});

// 🎤 Voice Input
const voiceBtn = document.getElementById("voiceBtn");
if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";

  voiceBtn.addEventListener("click", () => {
    recognition.start();
    voiceBtn.textContent = "🎙 Listening...";
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userNeed.value = transcript;
    voiceBtn.textContent = "🎤 Speak";
  };

  recognition.onerror = () => {
    alert("Voice input failed. Try again.");
    voiceBtn.textContent = "🎤 Speak";
  };
} else {
  voiceBtn.disabled = true;
  voiceBtn.textContent = "🎤 Not supported";
}

// 🌗 Theme Toggle
const themeToggleBtn = document.getElementById('themeToggle');
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  // Optional: Change button text/icon
  if (document.body.classList.contains('dark-mode')) {
    themeToggleBtn.textContent = '☀️ Light Mode';
  } else {
    themeToggleBtn.textContent = '🌙 Dark Mode';
  }
});


