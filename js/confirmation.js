const confirmation = JSON.parse(localStorage.getItem("bossConfirmation"));

const customerName = document.querySelector("[data-customer-name]");
const orderNumber = document.querySelector("[data-order-number]");
const orderType = document.querySelector("[data-order-type]");
const orderTime = document.querySelector("[data-order-time]");
const orderTotal = document.querySelector("[data-order-total]");
const confirmationItems = document.querySelector("[data-confirmation-items]");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
  }).format(value);
}

function renderConfirmation() {
  if (!confirmation) {
    customerName.textContent = "Boss";
    orderNumber.textContent = "No recent order";
    orderType.textContent = "-";
    orderTime.textContent = "-";
    orderTotal.textContent = "$0.00";
    confirmationItems.innerHTML = "<p>No order details were found.</p>";
    return;
  }
  orderNumber.textContent = confirmation.orderNumber;
  orderType.textContent = confirmation.orderType;
  orderTime.textContent = confirmation.time;
  orderTotal.textContent = formatCurrency(confirmation.total);

  confirmationItems.innerHTML = "";

  confirmation.cart.forEach((item) => {
    const optionText = item.glutenFree ? "Gluten free base" : "Regular base";

    const confirmationItem = document.createElement("article");
    confirmationItem.classList.add("confirmation-item");

    confirmationItem.innerHTML = `
      <strong>${item.quantity} x ${item.name}</strong>
      <small>${optionText}</small>
      <span>${formatCurrency(item.unitPrice * item.quantity)}</span>
    `;

    confirmationItems.appendChild(confirmationItem);
  });
}

renderConfirmation();