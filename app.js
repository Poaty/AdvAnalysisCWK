const PASSWORD = "fridge123";

const tabLogin = document.getElementById("tab-login");
const tabDelivery = document.getElementById("tab-delivery");
const passwordForm = document.getElementById("password-form");
const deliveryForm = document.getElementById("delivery-form");
const otpForm = document.getElementById("otp-form");
const app = document.getElementById("app");

let currentOtp = null;

function setMode(mode) {
  const loginMode = mode === "login";
  tabLogin.classList.toggle("active", loginMode);
  tabDelivery.classList.toggle("active", !loginMode);
  tabLogin.setAttribute("aria-selected", String(loginMode));
  tabDelivery.setAttribute("aria-selected", String(!loginMode));

  passwordForm.classList.toggle("hidden", !loginMode);
  deliveryForm.classList.toggle("hidden", loginMode);
  otpForm.classList.add("hidden");
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
  const typedPassword = document.getElementById("password-input").value;

  if (typedPassword === PASSWORD) {
    showBlankInterface();
  } else {
    alert("Incorrect password. Try again.");
  }
});

deliveryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const phone = document.getElementById("phone-input").value.trim();

  currentOtp = String(Math.floor(100000 + Math.random() * 900000));
  console.log(`OTP for ${phone}: ${currentOtp}`);

  otpForm.classList.remove("hidden");
  document.getElementById("otp-input").value = "";
});

otpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const otp = document.getElementById("otp-input").value.trim();

  if (otp === currentOtp) {
    showBlankInterface();
  } else {
    alert("Invalid OTP. Check console and try again.");
  }
});
