import { Product } from "./product.js";

const usersSection = document.getElementById("users-section");
const productsSection = document.getElementById("products-section");
const cartList = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const cartCountEl = document.getElementById("cart-count");

// ---------- Step 1 & 2: Fetch & Display users, with loading & error states ----------

async function loadUsers() {
  usersSection.innerHTML = `<p class="status">Loading...</p>`;

  try {
    // Change this URL to something broken to test the error state,
    // e.g. "https://jsonplaceholder.typicode.com/usersxxx"
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const users = await response.json();
    renderUsers(users);
  } catch (err) {
    usersSection.innerHTML = `<p class="status error">Couldn't load users right now. Please try again later.</p>`;
    console.error("Failed to load users:", err);
  }
}

function renderUsers(users) {
  usersSection.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "card-grid";

  for (const user of users) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${user.name}</h3>
      <p>${user.email}</p>
    `;
    grid.appendChild(card);
  }

  usersSection.appendChild(grid);
}

// ---------- Products ----------

const products = [
  new Product("Wireless Mouse", 150, "img's/images (3).jpg"),
  new Product("Router", 220, "img's/images.jpg"),
  new Product("JBL Bluetooth Speaker", 350, "img's/images (1).jpg"),
  new Product("Laptop Stand", 180, "img's/images (2).jpg"),
  new Product("Lenovo Thinkpad laptop", 6400, "img's/s-l1200.jpg"),
  new Product("Iphone 13", 5500, "img's/images (4).jpg"),
  new Product("Headphones(Airpods pro2)", 250, "img's/images (5).jpg"),
  new Product("Google Pixel 7pro", 4800, "img's/images (6).jpg"),
];

function renderProducts() {
  productsSection.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "card-grid";

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img class="product-img" src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p class="price">K${product.withTax().toFixed(2)} <span class="tax-tag">incl. tax</span></p>
      <p>Base price: K${product.price.toFixed(2)}</p>
      <div class="card-footer">
        <span class="add-label">Add to cart</span>
        <button class="add-btn" data-index="${index}" aria-label="Add ${product.name} to cart">+</button>
      </div>
    `;
    grid.appendChild(card);
  });

  productsSection.appendChild(grid);

  grid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      addToCart(products[index]);
    });
  });
}

// ---------- Step 5 & 6: Persistent cart, live total ----------

const CART_KEY = "mini-app-cart";

function loadCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

let cart = loadCart();

function addToCart(product) {
  cart.push({ name: product.name, price: product.price });
  saveCart(cart);
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart(cart);
  renderCart();
}

function cartTotalWithTax() {
  return cart.reduce((sum, item) => sum + item.price * 1.16, 0);
}

function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="status">Your cart is empty.</li>`;
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${item.name}</span><span>K${(item.price * 1.16).toFixed(2)}</span>`;
      cartList.appendChild(li);
    });
  }

  cartTotalEl.textContent = `Total: K${cartTotalWithTax().toFixed(2)}`;
  cartCountEl.textContent = cart.length;
}

clearCartBtn.addEventListener("click", clearCart);

// ---------- Init ----------

loadUsers();
renderProducts();
renderCart();
