const cartItemsContainer = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const emptyCartMessage = document.querySelector("[data-empty-cart]");
const checkoutLink = document.querySelector("[data-checkout-link]");
const cartWarning = document.querySelector("[data-cart-warning]");

let cart = JSON.parse(localStorage.getItem("bossCart")) || [];

function saveCart() {
  localStorage.setItem("bossCart", JSON.stringify(cart));
}

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

function removeItemFromCart(cartKey) {
  cart = cart.filter((item) => item.cartKey !== cartKey);
  saveCart();
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = "";
  emptyCartMessage.hidden = cart.length > 0;

  cart.forEach((item) => {
    const cartRow = document.createElement("article");
    cartRow.classList.add("cart-row");

    const optionText = item.glutenFree ? "Gluten free base" : "Regular base";

    cartRow.innerHTML = `
      <div>
        <strong>${item.quantity} x ${item.name}</strong>
        <small>${optionText}</small>
        <span>${formatCurrency(item.unitPrice)} each</span>
      </div>

      <div class="cart-row-actions">
        <strong>${formatCurrency(item.unitPrice * item.quantity)}</strong>
        <button type="button" data-remove-item="${item.cartKey}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartRow);
  });

  cartTotal.textContent = formatCurrency(calculateTotal());
}

cartItemsContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-item]");

  if (!removeButton) {
    return;
  }

  removeItemFromCart(removeButton.dataset.removeItem);
});

checkoutLink.addEventListener("click", (event) => {
  if (cart.length === 0) {
    event.preventDefault();
    cartWarning.textContent = "Add at least one item before checking out.";
  }
});

renderCart();