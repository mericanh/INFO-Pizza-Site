const checkoutForm = document.querySelector("[data-checkout-form]");
const formMessage = document.querySelector("[data-form-message]");
const summaryItems = document.querySelector("[data-summary-items]");
const summaryTotal = document.querySelector("[data-summary-total]");

const cart = JSON.parse(localStorage.getItem("bossCart")) || [];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
  }).format(value);
}

function calculateTotal() {
  return cart.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
}

function renderSummary() {
  summaryItems.innerHTML = "";

  if (cart.length === 0) {
    summaryItems.innerHTML = "<p>Your cart is empty.</p>";
    summaryTotal.textContent = "$0.00";
    return;
  }

  cart.forEach((item) => {
    const optionText = item.glutenFree ? "Gluten free base" : "Regular base";

    const summaryItem = document.createElement("article");
    summaryItem.classList.add("summary-item");

    summaryItem.innerHTML = `
      <strong>${item.quantity} x ${item.name}</strong>
      <small>${optionText}</small>
      <span>${formatCurrency(item.unitPrice * item.quantity)}</span>
    `;

    summaryItems.appendChild(summaryItem);
  });

  summaryTotal.textContent = formatCurrency(calculateTotal());
}

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    formMessage.textContent = "Your cart is empty. Please add items before placing an order.";
    return;
  }

  const formData = new FormData(checkoutForm);

  const confirmation = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    orderType: formData.get("orderType"),
    time: formData.get("time"),
    notes: formData.get("notes"),
    cart,
    total: calculateTotal(),
    orderNumber: `BOSS-${Date.now().toString().slice(-6)}`
  };

  localStorage.setItem("bossConfirmation", JSON.stringify(confirmation));
  localStorage.removeItem("bossCart");

  window.location.href = "confirmation.html";
});

renderSummary();