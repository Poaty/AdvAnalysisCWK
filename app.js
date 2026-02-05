const DEFAULT_PASSWORD = "fridge123";

const tabLogin = document.getElementById("tab-login");
const tabDelivery = document.getElementById("tab-delivery");
const passwordForm = document.getElementById("password-form");
const deliveryForm = document.getElementById("delivery-form");
const deliveryHint = document.getElementById("delivery-hint");
const app = document.getElementById("app");

let temporaryPassword = null;

function setMode(mode) {
  const loginMode = mode === "login";
  tabLogin.classList.toggle("active", loginMode);
  tabDelivery.classList.toggle("active", !loginMode);
  tabLogin.setAttribute("aria-selected", String(loginMode));
  tabDelivery.setAttribute("aria-selected", String(!loginMode));

  passwordForm.classList.toggle("hidden", !loginMode);
  deliveryForm.classList.toggle("hidden", loginMode);
}

function showBlankInterface() {
  app.innerHTML = "";
  app.style.background = "#fff";
  app.style.width = "100vw";
  app.style.height = "100vh";
}

tabLogin.addEventListener("click", () => setMode("login"));
tabDelivery.addEventListener("click", () => setMode("delivery"));

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const typedPassword = document.getElementById("password-input").value.trim();
  const isDefaultPassword = typedPassword === DEFAULT_PASSWORD;
  const isOtpPassword = temporaryPassword !== null && typedPassword === temporaryPassword;

  if (isDefaultPassword || isOtpPassword) {
    showBlankInterface();
  } else {
    alert("Incorrect password. Try again.");
  }
});

deliveryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const phone = document.getElementById("phone-input").value.trim();

  temporaryPassword = String(Math.floor(100000 + Math.random() * 900000));
  console.log(`Temporary login password for ${phone}: ${temporaryPassword}`);

  deliveryHint.textContent = "Password sent to console. Please switch to Login and enter it as your password.";
  deliveryHint.classList.remove("hidden");

  setMode("login");
  document.getElementById("password-input").focus();
});
