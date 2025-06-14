const startBtn = document.getElementById("startBtn");
const landingPage = document.getElementById("landingPage");
const toolPage = document.getElementById("toolPage");
const generateBtn = document.getElementById("generateBtn");
const userNeed = document.getElementById("userNeed");
const toolCode = document.getElementById("toolCode");
const livePreview = document.getElementById("livePreview");
const copyBtn = document.getElementById("copyBtn");

startBtn.addEventListener("click", () => {
  landingPage.style.display = "none";
  toolPage.style.display = "block";
});

generateBtn.addEventListener("click", async () => {
  const need = userNeed.value.trim();
  if (!need) return alert("Please describe your need.");

  toolCode.textContent = "⚙️ Generating your tool...";
  livePreview.srcdoc = "";

  try {
    const res = await fetch("http://localhost:3000/generate-tool", {
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


