const form = document.querySelector("#login-form");
const submitButton = document.querySelector("#submit-button");
const statusMessage = document.querySelector("#form-status");

form.addEventListener("input", () => {
  submitButton.classList.remove("sent");
  submitButton.querySelector("span").textContent = "Log in";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitButton.classList.add("sent");
  submitButton.querySelector("span").textContent = "Demo only";
  showStatus("This is a local demo. No data was sent.", "success");
});

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `form-status ${type}`;
}
