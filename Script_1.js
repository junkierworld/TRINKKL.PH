// Select elements
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');
const overlay = document.getElementById('overlay');
const layoutContainer = document.querySelector('.layout-container');

function openSidebar() {
  sidebar.classList.add('show');
  overlay.classList.add('active');
  document.body.classList.add('sidebar-open');
  layoutContainer.classList.add('sidebar-open');
  toggleBtn.textContent = 'Close Cart';
}

function closeSidebar() {
  sidebar.classList.remove('show');
  overlay.classList.remove('active');
  document.body.classList.remove('sidebar-open');
  layoutContainer.classList.remove('sidebar-open');
  toggleBtn.textContent = 'Open Cart';
}

toggleBtn.onclick = () => {
  if (sidebar.classList.contains('show')) {
    closeSidebar();
  } else {
    openSidebar();
  }
};

overlay.onclick = () => {
  closeSidebar();
};

const cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

function updateCartDisplay() {
  const container = document.getElementById('cart');
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p style="color:#ccc;">Your cart is empty.</p>';
    return;
  }
  cart.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <span>
        <strong>${item.name}</strong><br/>
        Qty: ${item.quantity}<br/>
        $${(item.price * item.quantity).toFixed(2)}
      </span>
      <button class="remove-btn" data-id="${item.id}">Remove</button>`;
    container.appendChild(div);
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const index = cart.findIndex(i => i.id === id);
      if (index !== -1) {
        cart.splice(index, 1);
        saveCart();
      }
    };
  });
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.onclick = () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const id = btn.dataset.id;
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
  };
});

const overlaySignUp = document.getElementById('signUpOverlay');
const startBtn = document.getElementById('startBtn');
const closeOverlayBtn = document.getElementById('closeSignUp');
const nextBtn = document.getElementByById('overlayNextBtn');
const overlayStepNumberSpan = document.getElementById('overlayStepNumber');
const overlayStepLabel = document.getElementById('overlayStepLabel');
const overlayInput = document.getElementById('overlayInput');

const stepsOverlay = [
  { label: "First Name", key: "firstName", placeholder: "First name" },
  { label: "Last Name", key: "lastName", placeholder: "Last name" },
  { label: "Email Address", key: "email", placeholder: "you@example.com", validate: v => /\S+@\S+\.\S+/.test(v) || "Invalid email" },
  { label: "Username", key: "username", placeholder: "Username" },
  { label: "Password", key: "password", placeholder: "Password" },
  { label: "Your Age", key: "age", placeholder: "18", validate: v => (!isNaN(v) && Number(v) > 0) || "Invalid age" },
  { label: "Gender", key: "gender", placeholder: "Gender" },
  { label: "Country", key: "country", placeholder: "Country" },
  { label: "Occupation", key: "occupation", placeholder: "Occupation" },
  { label: "Phone Number", key: "phone", placeholder: "Phone" }
];

let currentOverlayStep = 0;
let userDataOverlay = {};

function showOverlay() {
  overlaySignUp.classList.add('active');
  overlaySignUp.setAttribute('aria-hidden', 'false');
  currentOverlayStep = 0;
  userDataOverlay = {};
  updateOverlayStep();
  overlayInput.focus();
}

function hideOverlay() {
  overlaySignUp.classList.remove('active');
  overlaySignUp.setAttribute('aria-hidden', 'true');
}

function updateOverlayStep() {
  const step = stepsOverlay[currentOverlayStep];
  overlayStepNumberSpan.innerText = currentOverlayStep + 1;
  overlayStepLabel.innerText = step.label;
  overlayInput.value = userDataOverlay[step.key] || "";
  overlayInput.type = (step.key === 'password') ? 'password' : 'text';
  overlayInput.placeholder = step.placeholder || "";
  overlayInput.focus();
}

function validateInput(value) {
  const step = stepsOverlay[currentOverlayStep];
  if (step.validate) {
    const result = step.validate(value);
    if (result === true) return { ok: true };
    else return { ok: false, msg: result || "Invalid" };
  }
  if (value.trim() === "") return { ok: false, msg: "Field cannot be empty" };
  return { ok: true };
}

function handleNext() {
  const value = overlayInput.value || "";
  const validation = validateInput(value);
  if (!validation.ok) {
    alert(validation.msg);
    return;
  }
  userDataOverlay[stepsOverlay[currentOverlayStep].key] = value.trim();
  if (currentOverlayStep < stepsOverlay.length - 1) {
    currentOverlayStep++;
    updateOverlayStep();
  } else {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]");
    existingUsers.push(userDataOverlay);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    alert("Registration complete! Welcome aboard.");
    hideOverlay();
  }
}

startBtn.onclick = showOverlay;
document.getElementById('closeSignUp').onclick = hideOverlay;
nextBtn.onclick = handleNext;
overlaySignUp.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleNext();
});

document.querySelectorAll('.faq-item').forEach(item => {
  item.onclick = () => {
    const answer = item.querySelector('p');
    const image = item.querySelector('.faq-image');
    if (answer.style.display === 'block') {
      answer.style.display = 'none';
      if (image) image.style.display = 'none';
    } else {
      answer.style.display = 'block';
      if (image) image.style.display = 'block';
    }
  };
});

document.getElementById('toggleAllAnswers').onclick = () => {
  const answers = document.querySelectorAll('.faq-item p');
  const images = document.querySelectorAll('.faq-item .faq-image');
  const areAllVisible = Array.from(answers).every(a => a.style.display === 'block');
  answers.forEach((a, index) => {
    a.style.display = areAllVisible ? 'none' : 'block';
    if (images[index]) images[index].style.display = areAllVisible ? 'none' : 'block';
  });
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

function updateCartDisplay() {
  let cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cart.forEach((item, index) => {
    let itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span>${item.name} - $${item.price}</span>
      <button data-index="${index}">Remove</button>
    `;
    cartContainer.appendChild(itemDiv);
  });

  document.querySelectorAll('.cart-item button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index);
      cart.splice(idx, 1);
      saveCart();
    });
  });
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    const id = btn.dataset.id;

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      alert('This item is already in your cart.');
      return;
    }

    cart.push({ name, price, id });
    saveCart();
  });
});

const placeOrderBtn = document.createElement('button');
placeOrderBtn.textContent = 'Place Order';
placeOrderBtn.style.marginTop = '20px';
placeOrderBtn.style.padding = '10px 20px';
placeOrderBtn.style.border = 'none';
placeOrderBtn.style.borderRadius = '8px';
placeOrderBtn.style.backgroundColor = 'var(--neon-blue)';
placeOrderBtn.style.color = '#fff';
placeOrderBtn.style.cursor = 'pointer';

function createOrderSection() {
  let existingOrderSection = document.getElementById('order-section');
  if (existingOrderSection) return;

  const orderSection = document.createElement('div');
  orderSection.id = 'order-section';
  orderSection.style.marginTop = '30px';
  orderSection.innerHTML = `
    <h3>Your Order</h3>
    <div id="cart-items"></div>
    <button id="confirm-order" style="margin-top:20px; padding:10px 20px; border:none; border-radius:8px; background-color:#28a745; color:#fff; cursor:pointer;">Confirm Order</button>
  `;
  document.body.appendChild(orderSection);

  updateCartDisplay();

  document.getElementById('confirm-order').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    alert('Thank you for your order! We will contact you shortly.');
    cart = [];
    saveCart();
  });
}

createOrderSection();

document.body.appendChild(placeOrderBtn);