// Fixed order.js - Complete backend integration
console.log('🥤 Mixit Smoothies Order System Loading...');

// Menu data matching your website
const menuData = [
  // Smoothies
  { name: 'tropical paradise', price: 2500, category: 'smoothie' },
  { name: 'berry blast', price: 2800, category: 'smoothie' },
  { name: 'green detox', price: 3000, category: 'smoothie' },
  { name: 'choco banana', price: 2700, category: 'smoothie' },
  
  // Parfaits
  { name: 'classic yogurt parfait', price: 3000, category: 'parfait' },
  { name: 'berry indulgence', price: 3200, category: 'parfait' },
  { name: 'choco-crunch parfait', price: 3500, category: 'parfait' },
  
  // Cocktails
  { name: 'classic mojito', price: 4000, category: 'cocktail' },
  { name: 'sunset delight', price: 4500, category: 'cocktail' },
  { name: 'virgin colada', price: 4200, category: 'cocktail' },
  
  // Fresh Juices
  { name: 'orange juice', price: 2000, category: 'juice' },
  { name: 'watermelon splash', price: 2500, category: 'juice' },
  { name: 'apple mint', price: 2700, category: 'juice' }
];

// Load menu when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔄 Loading menu...');
  loadMenu();
  
  // Make sure the place order button works
  const placeOrderBtn = document.getElementById('placeOrder');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
    console.log('✅ Place order button connected');
  } else {
    console.error('❌ Place order button not found');
  }
});

function loadMenu() {
  const orderMenu = document.getElementById('orderMenu');
  if (!orderMenu) {
    console.error('❌ Order menu container not found');
    return;
  }
  
  console.log('📋 Building menu...');
  orderMenu.innerHTML = '';
  
  menuData.forEach((item, index) => {
    const menuItem = document.createElement('div');
    menuItem.style.cssText = `
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      margin: 12px 0; 
      padding: 15px; 
      background: rgba(255,255,255,0.9);
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    `;
    
    menuItem.innerHTML = `
      <div style="flex: 1;">
        <strong style="color: #333; text-transform: capitalize; font-size: 16px;">${item.name}</strong>
        <div style="color: #cd9452; font-weight: bold; font-size: 18px; margin-top: 5px;">₦${item.price.toLocaleString()}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button onclick="changeQuantity('${item.name}', -1)" style="
          background: #cd9452; 
          color: white; 
          border: none; 
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          cursor: pointer;
          font-size: 16px;
        ">-</button>
        <input 
          type="number" 
          id="qty-${item.name.replace(/\s+/g, '-')}" 
          data-name="${item.name}" 
          data-price="${item.price}"
          value="0" 
          min="0" 
          style="width: 50px; text-align: center; padding: 5px; border: 1px solid #ddd; border-radius: 4px;"
          onchange="updateTotal()"
        />
        <button onclick="changeQuantity('${item.name}', 1)" style="
          background: #cd9452; 
          color: white; 
          border: none; 
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          cursor: pointer;
          font-size: 16px;
        ">+</button>
      </div>
    `;
    
    orderMenu.appendChild(menuItem);
  });
  
  console.log('✅ Menu loaded successfully');
  updateTotal();
}

function changeQuantity(itemName, change) {
  const input = document.getElementById(`qty-${itemName.replace(/\s+/g, '-')}`);
  if (!input) return;
  
  const currentQty = parseInt(input.value) || 0;
  const newQty = Math.max(0, currentQty + change);
  input.value = newQty;
  updateTotal();
}

function updateTotal() {
  const inputs = document.querySelectorAll('#orderMenu input[type=number]');
  let total = 0;
  
  inputs.forEach(input => {
    const qty = parseInt(input.value) || 0;
    const price = parseInt(input.dataset.price) || 0;
    total += qty * price;
  });
  
  const totalPriceElement = document.getElementById('totalPrice');
  if (totalPriceElement) {
    totalPriceElement.textContent = total.toLocaleString();
  }
  
  // Enable/disable place order button
  const placeOrderBtn = document.getElementById('placeOrder');
  if (placeOrderBtn) {
    const hasItems = total > 0;
    const hasName = document.getElementById('name') && document.getElementById('name').value.trim();
    
    placeOrderBtn.disabled = !hasItems || !hasName;
    placeOrderBtn.style.opacity = placeOrderBtn.disabled ? '0.5' : '1';
  }
}

// Enhanced place order function
function placeOrder() {
  console.log('🚀 Placing order...');
  
  const nameInput = document.getElementById('name');
  const name = nameInput ? nameInput.value.trim() : '';
  
  if (!name) {
    alert('Please enter your name');
    if (nameInput) nameInput.focus();
    return;
  }
  
  const inputs = [...document.querySelectorAll('#orderMenu input[type=number]')];
  const items = inputs.map(i => ({
    smoothie: i.dataset.name,
    qty: Number(i.value),
    price: Number(i.dataset.price)
  })).filter(it => it.qty > 0);

  if (items.length === 0) {
    alert('Please select at least one item');
    return;
  }

  const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  
  // Create order object
  const order = {
    id: 'MX' + Date.now(),
    customerName: name,
    items: items,
    totalPrice: totalPrice,
    status: 'Pending',
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('en-NG'),
    time: new Date().toLocaleTimeString('en-NG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };

  console.log('📦 Order created:', order);

  // Save to localStorage
  try {
    let orders = JSON.parse(localStorage.getItem('mixitOrders')) || [];
    orders.push(order);
    localStorage.setItem('mixitOrders', JSON.stringify(orders));
    console.log('💾 Order saved to localStorage');
  } catch (error) {
    console.error('❌ Error saving order:', error);
    alert('Error saving order. Please try again.');
    return;
  }

  // Show success popup
  showOrderSuccessPopup(order);

  // Clear form
  inputs.forEach(i => i.value = 0);
  if (nameInput) nameInput.value = '';
  document.getElementById('totalPrice').textContent = '0';
  
  console.log('✅ Order placed successfully!');
}

function showOrderSuccessPopup(order) {
  console.log('🎉 Showing success popup');
  
  // Remove any existing popup
  const existingPopup = document.querySelector('.order-success-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create popup overlay
  const overlay = document.createElement('div');
  overlay.className = 'order-success-popup';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `;

  // Create popup content
  const popup = document.createElement('div');
  popup.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    position: relative;
    animation: slideIn 0.4s ease;
  `;

  const itemsList = order.items.map(item => 
    `${item.smoothie} x${item.qty}`
  ).join('<br>');

  popup.innerHTML = `
    <div style="color: #28a745; font-size: 3rem; margin-bottom: 15px;">
      ✅
    </div>
    <h2 style="color: #333; margin-bottom: 20px;">Order Placed Successfully!</h2>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
      <strong style="color: #cd9452;">Order ID:</strong> ${order.id}<br>
      <strong style="color: #cd9452;">Customer:</strong> ${order.customerName}<br>
      <strong style="color: #cd9452;">Items:</strong><br>
      <div style="margin-left: 10px; margin-top: 5px;">${itemsList}</div>
      <strong style="color: #cd9452;">Total:</strong> ₦${order.totalPrice.toLocaleString()}<br>
      <strong style="color: #cd9452;">Status:</strong> <span style="color: #ffc107;">Pending</span>
    </div>
    <p style="color: #666; margin-bottom: 25px;">
      <strong>Your order is on its way!</strong><br>
      We'll prepare your delicious smoothies and notify you when ready.
    </p>
    <button onclick="closeOrderPopup()" style="
      background: #cd9452;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    ">Awesome! 🎉</button>
  `;

  // Add CSS animations if not already added
  if (!document.querySelector('#popup-animations')) {
    const style = document.createElement('style');
    style.id = 'popup-animations';
    style.textContent = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideIn { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    `;
    document.head.appendChild(style);
  }

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeOrderPopup();
    }
  });

  // Auto close after 10 seconds
  setTimeout(() => {
    closeOrderPopup();
  }, 10000);
}

function closeOrderPopup() {
  const popup = document.querySelector('.order-success-popup');
  if (popup) {
    popup.remove();
  }
}

// Make functions globally available
window.placeOrder = placeOrder;
window.changeQuantity = changeQuantity;
window.updateTotal = updateTotal;
window.closeOrderPopup = closeOrderPopup;

// Monitor name input for button state
document.addEventListener('input', function(e) {
  if (e.target && e.target.id === 'name') {
    updateTotal();
  }
});

console.log('✅ Mixit Smoothies Order System Ready!');