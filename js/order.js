const addButtons = document.querySelectorAll("[data-add-item]");
const cartItemsContainer = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const emptyCartMessage = document.querySelector("[data-empty-cart]");
const reviewButton = document.querySelector("[data-review-order]");
const reviewMessage = document.querySelector("[data-review-message]");

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

function getCardOptions(button) {
  const card = button.closest(".order-card");
  const quantityInput = card.querySelector("[data-quantity]");
  const glutenInput = card.querySelector("[data-option='gluten-free']");

  const quantity = Math.max(1, Number(quantityInput.value));
  const wantsGlutenFree = glutenInput ? glutenInput.checked : false;
  const glutenEligible = button.dataset.glutenEligible === "true";

  return {
    quantity,
    glutenFree: glutenEligible && wantsGlutenFree
  };
}

function createCartKey(name, glutenFree) {
  return `${name}-${glutenFree ? "gluten-free" : "regular"}`;
}

function addItemToCart(name, basePrice, options) {
  const glutenCost = options.glutenFree ? 6 : 0;
  const unitPrice = basePrice + glutenCost;
  const cartKey = createCartKey(name, options.glutenFree);

  const existingItem = cart.find((item) => item.cartKey === cartKey);

  if (existingItem) {
    existingItem.quantity += options.quantity;
  } else {
    cart.push({
      cartKey,
      name,
      unitPrice,
      quantity: options.quantity,
      glutenFree: options.glutenFree
    });
  }

  saveCart();
  renderCart();
}

function removeItemFromCart(cartKey) {
  cart = cart.filter((item) => item.cartKey !== cartKey);
  saveCart();
  renderCart();
}

function calculateTotal() {
  return cart.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
}
function increaseItemQuantity(cartKey) {
  const item = cart.find((cartItem) => cartItem.cartKey === cartKey);

  if (!item) {
    return;
  }

  item.quantity += 1;
  saveCart();
  renderCart();
}

function decreaseItemQuantity(cartKey) {
  const item = cart.find((cartItem) => cartItem.cartKey === cartKey);

  if (!item) {
    return;
  }

  item.quantity -= 1;

  if (item.quantity <= 0) {
    removeItemFromCart(cartKey);
    return;
  }

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

        <div class="summary-quantity-control" aria-label="Update quantity for ${item.name}">
          <button type="button" data-decrease-item="${item.cartKey}">-</button>
          <span>${item.quantity}</span>
          <button type="button" data-increase-item="${item.cartKey}">+</button>
        </div>

        <button type="button" data-remove-item="${item.cartKey}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(cartRow);
  });

  cartTotal.textContent = formatCurrency(calculateTotal());
}

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const basePrice = Number(button.dataset.price);
    const options = getCardOptions(button);

    addItemToCart(name, basePrice, options);

    const card = button.closest(".order-card");

    card.classList.add("is-added");
    button.classList.add("is-added");
    button.textContent = "Added to cart";

    setTimeout(() => {
      card.classList.remove("is-added");
      button.classList.remove("is-added");
      button.textContent = "Add to order";
    }, 1200);
  });
});

cartItemsContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-item]");
  const increaseButton = event.target.closest("[data-increase-item]");
  const decreaseButton = event.target.closest("[data-decrease-item]");

  if (removeButton) {
    removeItemFromCart(removeButton.dataset.removeItem);
    return;
  }

  if (increaseButton) {
    increaseItemQuantity(increaseButton.dataset.increaseItem);
    return;
  }

  if (decreaseButton) {
    decreaseItemQuantity(decreaseButton.dataset.decreaseItem);
  }
});

reviewButton.addEventListener("click", () => {
  if (cart.length === 0) {
    reviewMessage.textContent = "Add at least one item before reviewing your order.";
    return;
  }

  window.location.href = "cart.html";
});

renderCart();