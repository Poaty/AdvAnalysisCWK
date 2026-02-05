const USERS = [
  { username: "Head Chef", authority: "high", password: "headchef123" },
  { username: "Chef", authority: "medium", password: "chef123" },
  { username: "Delivery Driver", authority: "delivery", password: "delivery123" }
];

const tabLogin = document.getElementById("tab-login");
const tabDelivery = document.getElementById("tab-delivery");
const passwordForm = document.getElementById("password-form");
const deliveryForm = document.getElementById("delivery-form");
const deliveryHint = document.getElementById("delivery-hint");
const app = document.getElementById("app");

let catalogItems = [];
let recordedItems = [];

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

function formatExpiryDate(isoDate) {
  if (!isoDate || !isoDate.includes("-")) {
    return isoDate || "";
  }
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year.slice(2)}`;
}

function toIsoDate(displayDate) {
  if (!displayDate || !displayDate.includes("/")) {
    return displayDate;
  }
  const [day, month, yy] = displayDate.split("/");
  const year = yy.length === 2 ? `20${yy}` : yy;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function renderRecordedItems() {
  const container = document.getElementById("recorded-items");
  const total = document.getElementById("total-items");
  total.textContent = String(recordedItems.reduce((sum, item) => sum + item.quantity, 0));

  container.innerHTML = "";
  recordedItems.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "record-card";
    card.innerHTML = `
      <div class="record-top">
        <div>
          <strong>${entry.itemName}</strong>
          <span class="pill">${entry.category}</span>
        </div>
        <div class="record-actions">
          <button class="edit" data-index="${index}" type="button">✏️</button>
          <button class="trash" data-index="${index}" type="button">🗑️</button>
        </div>
      </div>
      <div class="qty-row">Quantity <b>${entry.quantity}</b></div>
      <div class="date-row">
        <span>Date added: ${entry.dateAdded}</span>
        <span>Expires: ${formatExpiryDate(entry.expirationDate)}</span>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll(".trash").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-index"));
      recordedItems.splice(idx, 1);
      renderRecordedItems();
    });
  });

  container.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-index"));
      buildEditItemView(idx);
    });
  });
}

function buildEditItemView(index) {
  const item = recordedItems[index];
  app.innerHTML = `
    <section class="driver-page">
      <button id="back-record" class="back-btn" type="button">←</button>
      <div class="edit-card">
        <h3>Edit Item</h3>
        <input id="edit-name" type="text" value="${item.itemName}" />
        <input id="edit-category" type="text" value="${item.category}" />
        <input id="edit-quantity" type="number" min="1" value="${item.quantity}" />
        <input id="edit-expiry" type="text" value="${formatExpiryDate(item.expirationDate)}" />
        <button id="save-item" class="orange-btn" type="button">Save Changes</button>
      </div>
    </section>
  `;

  document.getElementById("back-record").addEventListener("click", buildRecordDeliveryView);
  document.getElementById("save-item").addEventListener("click", () => {
    const updatedName = document.getElementById("edit-name").value.trim();
    const updatedCategory = document.getElementById("edit-category").value.trim();
    const updatedQty = Number(document.getElementById("edit-quantity").value);
    const updatedExpiry = document.getElementById("edit-expiry").value.trim();

    if (!updatedName || !updatedCategory || updatedQty < 1 || !updatedExpiry) {
      alert("Please fill all fields with valid values.");
      return;
    }

    recordedItems[index] = {
      ...recordedItems[index],
      itemName: updatedName,
      category: updatedCategory,
      quantity: updatedQty,
      expirationDate: toIsoDate(updatedExpiry)
    };

    buildRecordDeliveryView();
  });
}

function buildRecordDeliveryView() {
  app.innerHTML = `
    <section class="driver-page">
      <button id="back-dashboard" class="back-btn" type="button">←</button>
      <div class="header-card"><h2>Record Delivery</h2></div>

      <div class="record-form-card">
        <h3>Delivery Items</h3>
        <label for="item-select">Item*</label>
        <select id="item-select">
          <option value="">Select Item</option>
        </select>

        <label for="item-qty">Quantity*</label>
        <input id="item-qty" type="number" min="1" value="1" />

        <button id="add-item" class="orange-btn" type="button">Add Item</button>
      </div>

      <button id="complete-delivery" class="dark-btn" type="button">Complete Delivery</button>
      <p class="total-line">Total items: <span id="total-items">0</span></p>
      <div id="recorded-items" class="records-list"></div>
    </section>
  `;

  const select = document.getElementById("item-select");
  catalogItems.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.itemName;
    opt.textContent = item.itemName;
    select.appendChild(opt);
  });

  document.getElementById("back-dashboard").addEventListener("click", renderDriverDashboard);

  document.getElementById("add-item").addEventListener("click", () => {
    const selectedName = select.value;
    const qty = Number(document.getElementById("item-qty").value);
    if (!selectedName || qty < 1) {
      alert("Please select an item and enter a valid quantity.");
      return;
    }

    const itemData = catalogItems.find((item) => item.itemName === selectedName);
    const today = new Date().toLocaleDateString("en-GB");
    recordedItems.push({ ...itemData, quantity: qty, dateAdded: today });
    renderRecordedItems();
  });

  document.getElementById("complete-delivery").addEventListener("click", () => {
    console.log("Delivery completed:", recordedItems);
    alert("Delivery recorded.");
  });

  renderRecordedItems();
}

function renderDriverDashboard() {
  app.innerHTML = `
    <section class="driver-page">
      <div class="header-card">
        <p>Welcome, Delivery Driver.</p>
        <h2>Dashboard</h2>
      </div>

      <div class="actions-card">
        <button id="open-rear-door" class="orange-btn" type="button">Open Rear Door</button>
        <button id="record-delivery" class="dark-btn" type="button">Record Delivery</button>
      </div>
    </section>
  `;

  document.getElementById("open-rear-door").addEventListener("click", () => {
    console.log("Rear door opened");
  });

  document.getElementById("record-delivery").addEventListener("click", buildRecordDeliveryView);
}

async function loadDeliveryCatalog() {
  try {
    const response = await fetch("res/deliveries.json");
    const data = await response.json();
    catalogItems = data.items || [];
  } catch (error) {
    console.error("Could not load deliveries.json", error);
    catalogItems = [];
  }
}

tabLogin.addEventListener("click", () => setMode("login"));
tabDelivery.addEventListener("click", () => setMode("delivery"));

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const typedPassword = document.getElementById("password-input").value.trim();
  const matchedUser = USERS.find((user) => user.password === typedPassword);

  if (!matchedUser) {
    alert("Incorrect password. Try again.");
    return;
  }

  console.log(`Welcome ${matchedUser.username}`);
  console.log(`Authority: ${matchedUser.authority}`);

  if (matchedUser.username === "Delivery Driver") {
    await loadDeliveryCatalog();
    renderDriverDashboard();
    return;
  }

  showBlankInterface();
});

deliveryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const phone = document.getElementById("phone-input").value.trim();

  const deliveryUser = USERS.find((user) => user.username === "Delivery Driver");
  const temporaryPassword = String(Math.floor(100000 + Math.random() * 900000));
  deliveryUser.password = temporaryPassword;

  console.log(`Temporary login password for ${phone}: ${temporaryPassword}`);
  console.log("Use this password in the Login tab for user: Delivery Driver");

  deliveryHint.textContent = "Password sent to console. Please switch to Login and enter it as your password.";
  deliveryHint.classList.remove("hidden");

  setMode("login");
  document.getElementById("password-input").focus();
});
