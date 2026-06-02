// ============================================================
//  🍭 Candy Shop — script.js (sql.js SQLite database)
// ============================================================

const SQL_CDN = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
const DB_KEY  = "candy_shop_db";

async function getDB() {
  const initSqlJs = await loadSqlJs();
  const SQL = await initSqlJs({
    locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}`
  });
  const saved = localStorage.getItem(DB_KEY);
  let db;
  if (saved) {
    const arr = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
    db = new SQL.Database(arr);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        customer_name TEXT,
        customer_email TEXT,
        address TEXT,
        items TEXT,
        total INTEGER,
        order_date TEXT
      );
    `);
    saveDB(db);
  }
  return db;
}

function saveDB(db) {
  const data = db.export();
  localStorage.setItem(DB_KEY, btoa(String.fromCharCode(...data)));
}

function loadSqlJs() {
  return new Promise((resolve, reject) => {
    if (window.initSqlJs) { resolve(window.initSqlJs); return; }
    const s = document.createElement("script");
    s.src = SQL_CDN;
    s.onload  = () => resolve(window.initSqlJs);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ── AUTH ─────────────────────────────────────────────────────

async function register() {
  const name  = document.getElementById("rname").value.trim();
  const email = document.getElementById("remail").value.trim();
  const pass  = document.getElementById("rpass").value;
  if (!name || !email || !pass) { showToast("⚠️ Fill all fields!"); return; }
  const db = await getDB();
  try {
    db.run("INSERT INTO customers (name,email,password) VALUES (?,?,?)", [name, email, pass]);
    saveDB(db);
    showToast("✅ Registered! Please login.");
  } catch(e) { showToast("❌ Email already exists!"); }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const pass  = document.getElementById("password").value;
  const db    = await getDB();
  const res   = db.exec("SELECT id,name,email FROM customers WHERE email=? AND password=?", [email, pass]);
  if (res.length && res[0].values.length) {
    const [id, name, cEmail] = res[0].values[0];
    localStorage.setItem("loggedUser", JSON.stringify({ id, name, email: cEmail }));
    window.location.href = "products.html";
  } else { showToast("❌ Wrong email or password!"); }
}

function logoutUser() {
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("cart");
  window.location.href = "inedx.html";
}

// ── PRODUCTS ─────────────────────────────────────────────────

const products = [
  {name:"Chocolate Cookie", price:50, img:"chocolate_cookie.jpg", cat:"cookie"},
  {name:"Oreo Cookie",      price:40, img:"orea_cookie.webp",     cat:"cookie"},
  {name:"Butter Cookie",    price:60, img:"butter_cookie.jpg",    cat:"cookie"},
  {name:"Choco Chip",       price:55, img:"choco_chip.webp",      cat:"cookie"},
  {name:"Strawberry Cookie",price:65, img:"strawberry.jpg",       cat:"cookie"},
  {name:"Vanilla Cookie",   price:45, img:"vanilla.jpg",          cat:"cookie"},
  {name:"Dark Chocolate",   price:70, img:"chocolate_cookie.jpg", cat:"cookie"},
  {name:"Cream Biscuit",    price:35, img:"cream_Biscuit.jpg",    cat:"cookie"},
  {name:"Sugar Cookie",     price:30, img:"sugar_Cookie.jpg",     cat:"cookie"},
  {name:"Honey Cookie",     price:50, img:"honey_Cookie.jpg",     cat:"cookie"},
  {name:"Almond Cookie",    price:80, img:"almond_Cookie.jpg",    cat:"cookie"},
  {name:"Peanut Cookie",    price:45, img:"peanut_Cookie.jpg",    cat:"cookie"},
  {name:"Coconut Cookie",   price:55, img:"coconut_Cookie.jpg",   cat:"cookie"},
  {name:"Caramel Cookie",   price:60, img:"caramel_Cookie.jpg",   cat:"cookie"},
  {name:"Oatmeal Cookie",   price:50, img:"oatmeal_Cookie.jpg",   cat:"cookie"},
  {name:"Lollipop",         price:20, img:"lollipop.jpg",         cat:"candy"},
  {name:"Gummy Bear",       price:25, img:"gummy_Bear.jpg",       cat:"candy"},
  {name:"Jelly Candy",      price:30, img:"jelly_Candy.jpg",      cat:"candy"},
  {name:"Mint Candy",       price:15, img:"mint_Candy.jpg",       cat:"candy"},
  {name:"Fruit Candy",      price:20, img:"fruit_Candy.jpg",      cat:"candy"},
  {name:"Orange Candy",     price:25, img:"orange_Candy.jpg",     cat:"candy"},
  {name:"Milk Candy",       price:35, img:"milk_Candy.jpg",       cat:"candy"},
  {name:"Caramel Candy",    price:40, img:"caramel_Candy.jpg",    cat:"candy"},
  {name:"Chocolate Candy",  price:45, img:"chocolate_Candy.jpg",  cat:"candy"},
  {name:"Cotton Candy",     price:50, img:"cotton_Candy.jpg",     cat:"candy"},
  {name:"Rock Candy",       price:20, img:"rock_Candy.jpg",       cat:"candy"},
  {name:"Sour Candy",       price:25, img:"sour_Candy.jpg",       cat:"candy"},
  {name:"Gummy Worm",       price:30, img:"gummy_Worm.jpg",       cat:"candy"},
  {name:"Toffee",           price:35, img:"toffee.jpg",           cat:"candy"}
];

let productQty = {};

function changeProductQty(index, change) {
  if (!productQty[index]) productQty[index] = 1;
  productQty[index] = Math.max(1, productQty[index] + change);
  document.getElementById("qty-" + index).innerText = productQty[index];
}

if (document.getElementById("products")) {
  const div = document.getElementById("products");
  const badgeMap = { cookie: "🍪 Cookie", candy: "🍭 Candy" };

  products.forEach((item, index) => {
    const d = document.createElement("div");
    d.className = "product";
    d.dataset.cat = item.cat;
    d.innerHTML = `
      <div class="product-badge">${badgeMap[item.cat]}</div>
      <img src="${item.img}" alt="${item.name}" onerror="this.src='chocolate_cookie.jpg'">
      <div class="product-body">
        <h4>${item.name}</h4>
        <div class="price">₹${item.price}</div>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeProductQty(${index},-1)">−</button>
          <span class="qty-val" id="qty-${index}">1</span>
          <button class="qty-btn" onclick="changeProductQty(${index},1)">+</button>
        </div>
        <button class="add-btn" onclick="addCartWithQty(${index})">Add to Cart 🛒</button>
      </div>
    `;
    div.appendChild(d);
  });
}

function addCartWithQty(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = products[index];
  const qty  = productQty[index] || 1;
  for (let i = 0; i < qty; i++) cart.push({ name: item.name, price: item.price });
  localStorage.setItem("cart", JSON.stringify(cart));

  // update count
  const cc = document.getElementById("cartCount");
  if (cc) cc.textContent = cart.length;

  showToast(`✅ ${qty}× ${item.name} added!`);
}

// ── CART ─────────────────────────────────────────────────────

if (document.getElementById("cartItems")) {
  const cart    = JSON.parse(localStorage.getItem("cart")) || [];
  const ul      = document.getElementById("cartItems");
  const totalBox = document.getElementById("totalBox");
  const actionBtns = document.getElementById("actionBtns");

  if (cart.length === 0) {
    ul.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🛒</div>
        <p>Your cart is empty!</p>
        <br>
        <button onclick="window.location.href='products.html'" style="margin:0 auto;display:block">Browse Sweets 🍭</button>
      </div>`;
  } else {
    const grouped = {};
    cart.forEach(item => {
      grouped[item.name] = grouped[item.name] || { price: item.price, qty: 0 };
      grouped[item.name].qty++;
    });

    let total = 0;
    Object.entries(grouped).forEach(([name, { price, qty }]) => {
      total += price * qty;
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${name}</div>
            <div class="cart-item-sub">₹${price} × ${qty} pieces</div>
          </div>
          <div class="cart-item-price">₹${price * qty}</div>
          <button class="btn-remove" onclick="removeAllOf('${name}')">Remove</button>
        </div>`;
      ul.appendChild(li);
    });

    totalBox.style.display = "flex";
    actionBtns.style.display = "flex";
    document.getElementById("total").textContent = "₹" + total;
  }
}

function removeAllOf(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(i => i.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

// ── BILL ─────────────────────────────────────────────────────

if (document.getElementById("billItems")) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const ul   = document.getElementById("billItems");
  const grouped = {};
  let total = 0;

  cart.forEach(item => {
    grouped[item.name] = grouped[item.name] || { price: item.price, qty: 0 };
    grouped[item.name].qty++;
  });

  Object.entries(grouped).forEach(([name, { price, qty }]) => {
    total += price * qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="bill-row">
        <div><div class="item-name">${name}</div><div class="item-qty">${qty} × ₹${price}</div></div>
        <div style="font-weight:900;color:var(--primary)">₹${price * qty}</div>
      </div>`;
    ul.appendChild(li);
  });

  document.getElementById("billTotal").textContent = "₹" + total;
}

// ── ADDRESS ───────────────────────────────────────────────────

function placeOrder() {
  const addr  = document.getElementById("addr").value.trim();
  const city  = document.getElementById("dcity") ? document.getElementById("dcity").value.trim() : "";
  const name  = document.getElementById("dname") ? document.getElementById("dname").value.trim() : "";
  if (!addr) { showToast("⚠️ Please enter your address!"); return; }
  const fullAddr = [name, addr, city].filter(Boolean).join(", ");
  localStorage.setItem("deliveryAddress", fullAddr);
  window.location.href = "bill.html";
}

// ── PAYMENT ───────────────────────────────────────────────────

async function payNow() {
  const cart    = JSON.parse(localStorage.getItem("cart")) || [];
  const address = localStorage.getItem("deliveryAddress") || "N/A";
  const user    = JSON.parse(localStorage.getItem("loggedUser") || "null");

  if (cart.length === 0) { showToast("⚠️ Cart is empty!"); return; }

  const total = cart.reduce((s, i) => s + i.price, 0);

  const grouped = {};
  cart.forEach(item => {
    grouped[item.name] = grouped[item.name] || { price: item.price, qty: 0 };
    grouped[item.name].qty++;
  });

  const now    = new Date().toLocaleString("en-IN");
  const db     = await getDB();
  db.run(
    `INSERT INTO orders (customer_id,customer_name,customer_email,address,items,total,order_date)
     VALUES (?,?,?,?,?,?,?)`,
    [user?.id ?? null, user?.name ?? "Guest", user?.email ?? "guest@shop.com",
     address, JSON.stringify(grouped), total, now]
  );
  saveDB(db);

  localStorage.removeItem("cart");
  localStorage.removeItem("deliveryAddress");

  showToast("🎉 Payment successful! Order saved!");
  setTimeout(() => window.location.href = "products.html", 2000);
}

// ── ORDERS PAGE ───────────────────────────────────────────────

async function loadOrders() {
  const container = document.getElementById("ordersContainer");
  if (!container) return;

  const user    = JSON.parse(localStorage.getItem("loggedUser") || "null");
  const db      = await getDB();
  const isAdmin = document.body.dataset.admin === "true";

  const query  = isAdmin
    ? "SELECT * FROM orders ORDER BY id DESC"
    : "SELECT * FROM orders WHERE customer_id=? ORDER BY id DESC";
  const params = isAdmin ? [] : [user?.id];

  if (!isAdmin && !user) {
    container.innerHTML = `<div class="cart-empty"><div class="icon">🔐</div><p>Please <a href="inedx.html">login</a> to view orders.</p></div>`;
    return;
  }

  const res = db.exec(query, params);
  if (!res.length || !res[0].values.length) {
    container.innerHTML = `<div class="cart-empty"><div class="icon">📦</div><p>No orders yet. Go shop some sweets!</p></div>`;
    return;
  }

  const cols = res[0].columns;
  container.innerHTML = "";
  res[0].values.forEach(row => {
    const obj = {};
    cols.forEach((c, i) => obj[c] = row[i]);
    const items = JSON.parse(obj.items || "{}");
    const itemsList = Object.entries(items)
      .map(([n, { qty, price }]) => `<li>${n} × ${qty} = ₹${price * qty}</li>`).join("");

    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <div class="order-header">
        <span>Order #${obj.id}</span>
        <span class="order-date">${obj.order_date}</span>
      </div>
      <div class="order-meta">
        <strong>👤 ${obj.customer_name}</strong> (${obj.customer_email})<br>
        <strong>📍</strong> ${obj.address}
      </div>
      <ul class="order-items">${itemsList}</ul>
      <div class="order-total">💰 Total: ₹${obj.total}</div>
    `;
    container.appendChild(card);
  });
}

// ── TOAST ────────────────────────────────────────────────────

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

// ── NAV HELPERS ───────────────────────────────────────────────

function goCart()    { window.location.href = "cart.html"; }
function goAddress() { window.location.href = "address.html"; }
function goBill()    { window.location.href = "bill.html"; }
function goPayment() { window.location.href = "payment.html"; }

// ── AUTO INIT ─────────────────────────────────────────────────

if (document.getElementById("ordersContainer")) loadOrders();
