# CandyShop
# Sweet Bites — Candy & Cookie Shop

A fully functional frontend e-commerce web app for cookies and candies — built with pure HTML, CSS, and JavaScript. No backend, no framework — just clean vanilla code with a SQLite database running right inside the browser!

---

## Live Demo

* Open `inedx.html` in your browser to get started.

---

## Screenshots

| Page             | Preview                                |
| ---------------- | -------------------------------------- |
| Login / Register | Split-screen with candy hero panel     |
| Shop             | Product grid with category filter      |
| Cart             | Grouped items with live total          |
| Bill             | Receipt-style invoice                  |
| Payment          | Live card preview while typing         |
| My Orders        | Order history from database            |
| Admin Panel      | Password-protected, all orders + stats |

---

## Features

* Login & Register — tab-switch UI, no page reload
* 29+ Products — Cookies & Candies with category filter
* Smart Cart — add with quantity, grouped view, live count badge
* Delivery Address — full form with name, phone, city
* Invoice / Bill — receipt-style order summary
* Payment Page — live card preview (number, name, expiry update in real-time)
* My Orders — personal order history saved in SQL database
* Admin Panel — password protected (`key123`), view all customer orders with stats & search
* Admin Lock — session-based, auto-locks on browser close
* Toast Notifications — smooth slide-up alerts
* Progress Steps Bar — Cart → Address → Bill → Pay visual flow

---

## Database

This project uses sql.js — a full SQLite engine compiled to WebAssembly, running 100% in the browser.

### Tables

```sql
-- Stores registered users
CREATE TABLE customers (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL,
  email    TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Stores every placed order
CREATE TABLE orders (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id    INTEGER,
  customer_name  TEXT,
  customer_email TEXT,
  address        TEXT,
  items          TEXT,
  total          INTEGER,
  order_date     TEXT,
  FOREIGN KEY(customer_id) REFERENCES customers(id)
);
```

* The database is exported as a Base64 binary and saved in `localStorage` — so your data persists across page refreshes in the same browser.

---

## Project Structure

```text
sweet-bites/
│
├── inedx.html
├── products.html
├── cart.html
├── address.html
├── bill.html
├── payment.html
├── orders.html
├── admin_orders.html
│
├── style.css
├── script.js
│
└── *.jpg / *.webp
```

---

## Tech Stack

| Technology         | Usage                                           |
| ------------------ | ----------------------------------------------- |
| HTML5              | Page structure, multi-page routing              |
| CSS3               | Styling, gradients, animations, responsive grid |
| Vanilla JavaScript | DOM, events, localStorage, sessionStorage       |
| sql.js             | SQLite database in the browser (via CDN)        |
| Google Fonts       | Pacifico (logo) + Nunito (body)                 |

---

## How to Run

### Option 1 — Open Directly

```text
Just double-click inedx.html — opens in your browser!
```

* Note: sql.js loads from CDN on first use. Make sure you have internet connection the first time you open the app.

### Option 2 — Local Server (Recommended)

```bash
# Using Python
python -m http.server 5500

# Using Node.js
npx serve .

# Using VS Code
Install "Live Server" extension
Right click inedx.html
Open with Live Server
```

Then open:

```text
http://localhost:5500/inedx.html
```

---

## Test Credentials

You can register a new account, or use these after registering:

| Field    | Value                                   |
| -------- | --------------------------------------- |
| Email    | [test@candy.com](mailto:test@candy.com) |
| Password | 123456                                  |

### Admin Access

| Field    | Value             |
| -------- | ----------------- |
| URL      | admin_orders.html |
| Password | key123            |

---

## Pages Flow

```text
inedx.html  ──►  products.html  ──►  cart.html
                                         │
                                    address.html
                                         │
                                      bill.html
                                         │
                                    payment.html
                                         │
                                  Order Saved to DB
                                         │
                              orders.html / admin_orders.html
```

---

## Design Highlights

* Pink & Coral gradient theme — inspired by Indian candy brand aesthetics
* Pacifico font for the brand logo — fun, sweet feel
* Sticky navbar with live cart count badge
* Card hover animations — lift + scale on product cards
* Shake animation on wrong admin password
* Live card preview on payment page — updates as you type
* Dark navy admin lock screen — professional & secure look

---

## About

This project was built as an Internship Project to demonstrate:

* Frontend development skills
* SQL database design & queries
* UI/UX design
* Pure JavaScript DOM manipulation
* No-backend full-stack simulation using browser APIs

---

## License

* This project is open source and free to use for learning purposes.

---

<p align="center">Made with Love | Sweet Bites Candy Shop</p>
