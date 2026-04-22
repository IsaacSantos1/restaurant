const NJ_TAX_RATE = 0.06625;

const cartCountEl = document.getElementById("cart-count");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartTaxEl = document.getElementById("cart-tax");
const cartTotalEl = document.getElementById("cart-total");
const cartItemsEl = document.getElementById("cart-items");
const buttons = document.querySelectorAll(".add-btn");

const cart = {};

function formatMoney(value) {
  return value.toFixed(2);
}

function renderCart() {
  const entries = Object.values(cart);

  const totalItems = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * NJ_TAX_RATE;
  const total = subtotal + tax;

  cartCountEl.textContent = totalItems;
  cartSubtotalEl.textContent = formatMoney(subtotal);
  cartTaxEl.textContent = formatMoney(tax);
  cartTotalEl.textContent = formatMoney(total);

  if (entries.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    return;
  }

  cartItemsEl.innerHTML = entries
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-top">
            <div class="cart-item-name">${item.name}</div>
          </div>
          <div class="cart-item-meta">
            Qty: ${item.quantity} • $${formatMoney(item.price)} each • $${formatMoney(item.quantity * item.price)}
          </div>
          <div class="cart-actions">
            <button class="cart-btn remove-one" data-name="${item.name}">-1</button>
            <button class="cart-btn remove-all" data-name="${item.name}">Remove</button>
          </div>
        </div>
      `
    )
    .join("");

  attachCartButtonEvents();
}

function attachCartButtonEvents() {
  const removeOneButtons = document.querySelectorAll(".remove-one");
  const removeAllButtons = document.querySelectorAll(".remove-all");

  removeOneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemName = button.dataset.name;

      if (!cart[itemName]) return;

      cart[itemName].quantity -= 1;

      if (cart[itemName].quantity <= 0) {
        delete cart[itemName];
      }

      renderCart();
    });
  });

  removeAllButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemName = button.dataset.name;

      if (!cart[itemName]) return;

      delete cart[itemName];
      renderCart();
    });
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".menu-card");
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    if (!cart[name]) {
      cart[name] = {
        name,
        price,
        quantity: 1
      };
    } else {
      cart[name].quantity += 1;
    }

    renderCart();
  });
});

renderCart();