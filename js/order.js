const addButtons = document.querySelectorAll("[data-add-item]");
const cartItemsContainer = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const emptyCartMessage = document.querySelector("[data-empty-cart]");
const reviewButton = document.querySelector("[data-review-order]");
const reviewMessage = document.querySelector("[data-review-message]");

const cart = [];

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

  renderCart();
}

function calculateTotal() {
  return cart.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
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

function removeItemFromCart(cartKey) {
  const itemIndex = cart.findIndex((item) => item.cartKey === cartKey);

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
  }

  renderCart();
}

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const basePrice = Number(button.dataset.price);
    const options = getCardOptions(button);

    addItemToCart(name, basePrice, options);

    button.textContent = "Added";
    setTimeout(() => {
      button.textContent = "Add to order";
    }, 800);
  });
});

reviewButton.addEventListener("click", () => {
  if (cart.length === 0) {
    reviewMessage.textContent = "Add at least one item before reviewing your order.";
    return;
  }

  reviewMessage.textContent = `Order is ready. Your total is ${formatCurrency(calculateTotal())}.`;
});

cartItemsContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-item]");

  if (!removeButton) {
    return;
  }

  removeItemFromCart(removeButton.dataset.removeItem);
});