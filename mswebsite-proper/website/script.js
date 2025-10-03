let navbar = document.querySelector('.header .navbar');
let menuBtn = document.querySelector('#menu-btn');

menuBtn.onclick = () =>{
   menuBtn.classList.toggle('fa-times');
   navbar.classList.toggle('active');
};

window.onscroll = () =>{
   menuBtn.classList.remove('fa-times');
   navbar.classList.remove('active');
};

var swiper = new Swiper(".home-slider", {
   grabCursor:true,
   loop:true,
   centeredSlides:true,
   navigation: {
     nextEl: ".swiper-button-next",
     prevEl: ".swiper-button-prev",
   },
});

var swiper = new Swiper(".food-slider", {
   grabCursor:true,
   loop:true,
   centeredSlides:true,
   spaceBetween: 20,
   pagination: {
      el: ".swiper-pagination",
      clickable: true,
   },
   breakpoints: {
      0: {
        slidesPerView: 1,
      },
      700: {
        slidesPerView: 2,
      },
      1000: {
        slidesPerView: 3,
      },
   },
});

let previewContainer = document.querySelector('.food-preview-container');
let previewBox = previewContainer.querySelectorAll('.food-preview');

document.querySelectorAll('.food .slide').forEach(food =>{
   food.onclick = () =>{
      previewContainer.style.display = 'flex';
      let name = food.getAttribute('data-name');
      previewBox.forEach(preveiw =>{
         let target = preveiw.getAttribute('data-target');
         if(name == target){
            preveiw.classList.add('active');
         }
      });
   };
});

previewContainer.querySelector('#close-preview').onclick = () =>{
   previewContainer.style.display = 'none';
   previewBox.forEach(close =>{
      close.classList.remove('active');
   });
};

var swiper = new Swiper(".menu-slider", {
   grabCursor:true,
   loop:true,
   autoHeight:true,
   centeredSlides:true,
   spaceBetween: 20,
   pagination: {
      el: ".swiper-pagination",
      clickable: true,
   },
});

 
document.addEventListener("DOMContentLoaded", () => {
  const base = document.getElementById("base");
  const fruits = document.getElementById("fruits");
  const booster = document.getElementById("booster");
  const sweet = document.getElementById("sweet");
  const ice = document.getElementById("ice");
  const size = document.getElementById("size");
  const previewText = document.getElementById("preview-text");

/* document.addEventListener('DOMContentLoaded', loadMenu); */
document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("customerName").value;
      const phone = document.getElementById("customerPhone").value;
      const address = document.getElementById("customerAddress").value;

      const previewText = document.getElementById("preview-text")
        ? document.getElementById("preview-text").textContent
        : "Custom Smoothie";

      const selectedFood = document.querySelector(".food-preview.active h3");
      const orderItem = selectedFood ? selectedFood.textContent : previewText;

      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            items: [{ name: orderItem }],
          }),
        });

        const data = await res.json();
        if (res.ok) {
          alert(`Order placed! Total ₦${data.total}`);
          orderForm.reset();
        } else {
          alert("Error: " + data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  }
});


  function updatePreview() {
    const baseVal = base.value;
    const fruitsVal = Array.from(fruits.selectedOptions).map(o => o.value).slice(0,3);
    const boosterVal = booster.value;
    const sweetVal = sweet.value;
    const iceVal = ice.value;
    const sizeVal = size.textContent.trim();

    previewText.textContent = `${baseVal} + ${fruitsVal.join(", ")} + ${boosterVal} | Sweetness: ${sweetVal}/5 | Ice: ${iceVal}/5 | Size: ${sizeVal}`;
  }

  // Initial preview
  updatePreview();

  // Event listeners
  [base, fruits, booster, sweet, ice].forEach(el => el.addEventListener("input", updatePreview));
  size.addEventListener("click", () => {
    size.textContent = size.textContent.includes("500ml") ? "750ml" : "500ml";
    updatePreview();
  });
});

/* <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mixit Admin Dashboard</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    .hidden { display: none; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    table, th, td { border: 1px solid #ddd; }
    th, td { padding: 8px; }
    th { background: #f5f5f5; }
    button { margin: 2px; padding: 5px 10px; }
  </style>
</head>
<body>
  <h1>Mixit Admin Dashboard</h1>

  <!-- Login form -->
  <div id="login-section">
    <h3>Admin Login</h3>
    <form id="login-form">
      <input type="email" id="email" placeholder="Email" required><br><br>
      <input type="password" id="password" placeholder="Password" required><br><br>
      <button type="submit">Login</button>
    </form>
  </div>

  <!-- Orders view -->
  <div id="orders-section" class="hidden">
    <h3>Orders</h3>
    <table id="orders-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Phone</th>
          <th>Items</th>
          <th>Blend</th>
          <th>Total (₦)</th>
          <th>Status</th>
          <th>Update</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

  <script>
    const API_URL = "http://localhost:5000/api";
    let token = "";

    const loginForm = document.getElementById("login-form");
    const loginSection = document.getElementById("login-section");
    const ordersSection = document.getElementById("orders-section");
    const ordersTableBody = document.querySelector("#orders-table tbody");

    // Login handler
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        token = data.token;
        loginSection.classList.add("hidden");
        ordersSection.classList.remove("hidden");
        loadOrders();
      } catch (err) {
        alert("Login error: " + err.message);
      }
    });

    // Load orders
    async function loadOrders() {
      try {
        const res = await fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const orders = await res.json();
        if (!res.ok) throw new Error(orders.error || "Failed to fetch orders");

        ordersTableBody.innerHTML = "";
        orders.forEach(order => {
          const row = document.createElement("tr");

          // Customer info
          row.innerHTML = `
            <td>${order.customerName}</td>
            <td>${order.phone || ""}</td>
            <td>
              ${order.items.map(i => `${i.name} (x${i.quantity})`).join("<br>")}
            </td>
            <td>
              ${order.customBlend ? `
                Base: ${order.customBlend.base}<br>
                Fruits: ${order.customBlend.fruits.join(", ")}<br>
                Booster: ${order.customBlend.booster}<br>
                Size: ${order.customBlend.size}
              ` : ""}
            </td>
            <td>${order.total}</td>
            <td>${order.status}</td>
          `;

          // Status buttons
          const td = document.createElement("td");
          ["pending","confirmed","preparing","ready","completed","cancelled"].forEach(st => {
            const btn = document.createElement("button");
            btn.textContent = st;
            btn.onclick = () => updateStatus(order._id, st);
            td.appendChild(btn);
          });
          row.appendChild(td);

          ordersTableBody.appendChild(row);
        });
      } catch (err) {
        console.error(err);
        alert("Error loading orders");
      }
    }

    async function updateStatus(orderId, status) {
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update");
        loadOrders(); // reload table
      } catch (err) {
        alert("Status update failed: " + err.message);
      }
    }
  </script>
</body>
</html>
 */

const blendBtn = document.getElementById("blend-order-btn");

blendBtn.addEventListener("click", async () => {
  const customBlend = {
    base: document.getElementById('base').value,
    fruits: Array.from(document.getElementById('fruits').selectedOptions).map(o => o.value).slice(0,3),
    booster: document.getElementById('booster').value,
    sweetness: Number(document.getElementById('sweet').value),
    ice: Number(document.getElementById('ice').value),
    size: document.getElementById('size').textContent.trim(),
    price: 1500 // you can compute logic, or leave 0; server accepts numeric
  };

  const payload = {
    customerName: prompt("Enter your name:"),
    phone: prompt("Enter your phone number:"),
    address: prompt("Enter your address:"),
    items: [], // no predefined menu items, only custom blend
    customBlend,
    pickupOrDelivery: "delivery",
    when: null,
    notes: ""
  };

  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to place blend order");
    alert(`Blend order placed! Total ₦${result.total}, Order ID: ${result.orderId}`);
  } catch (err) {
    alert("Blend order failed: " + err.message);
  }
});
