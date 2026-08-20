// Shopping Cart Management System

// Format currency for Egyptian Pound
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('sharkawyCart')) || [];
    this.products = [];
    this.initializeCart();
    this.attachEventListeners();
  }

  initializeCart() {
    this.loadProducts();
    this.updateCartUI();
    this.attachAddToCartButtons();
  }

  loadProducts() {
    this.products = [
      // Phones
      { id: 1, name: 'iPhone 16 Pro', price: 999, image: 'iphone 16 pro.jpeg', category: 'phones', specs: ['Display: 6.3-inch Super Retina XDR', 'Chip: A18 Pro', 'Camera: 48MP Pro camera system', 'Battery: Ultra-long battery life'] },
      { id: 2, name: 'iPhone 16', price: 799, image: 'iphone 16.webp', category: 'phones', specs: ['Display: 6.1-inch Super Retina XDR', 'Chip: A18', 'Camera: 48MP main camera', 'Battery: Ultra-long battery life'] },
      { id: 3, name: 'iPhone 17', price: 1099, image: 'iphone 17.jpg', category: 'phones', specs: ['Display: 6.7-inch OLED display', 'Chip: Advanced performance chip', 'Camera: Dual 48MP lens system', 'Battery: Extended battery technology'] },
      { id: 4, name: 'iPhone 17 Pro', price: 1299, image: 'iphone-17-pro.webp', category: 'phones', specs: ['Display: 6.9-inch ProMotion display', 'Chip: Pro-level processing power', 'Camera: Triple camera setup with 48MP main', 'Battery: Premium battery performance'] },
      { id: 5, name: 'Realme Phone', price: 499, image: 'realme.jpg', category: 'phones', specs: ['Display: 6.5-inch AMOLED display', 'Chip: Fast octa-core processor', 'Camera: 108MP AI camera system', 'Battery: 5000mAh capacity'] },
      // Accessories
      { id: 6, name: 'AirPods Pro', price: 249, image: 'airpods.jpg', category: 'accessories', specs: ['Bluetooth: 5.3 support', 'Battery: Up to 6 hours listening time', 'Features: Active Noise Cancellation', 'Design: Premium comfort fit'] },
      { id: 7, name: 'Fast Charger', price: 49.99, image: 'charger.jpg', category: 'accessories', specs: ['Power: 65W fast charging', 'Compatibility: USB-C devices', 'Safety: Smart temperature control', 'Speed: Full charge in 30 minutes'] },
    ];
  }

  getProductSpecs(productName) {
    const product = this.products.find(p => p.name === productName);
    return product?.specs || [
      'Display: Premium modern display',
      'Performance: Fast and efficient processing',
      'Camera: High-quality camera system',
      'Battery: Long-lasting power'
    ];
  }

  getProductData(productCard) {
    const productName = productCard.querySelector('h3')?.textContent?.trim();
    const productPriceText = productCard.querySelector('.price')?.textContent || '0';
    const productDescription = productCard.querySelector('.description')?.textContent?.trim() || 'Premium product from Sharkawy Phones';
    const productImage = productCard.querySelector('.product-image img')?.src || productCard.querySelector('.product-image')?.textContent || '';
    const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, '')) || 0;
    const productSpecs = productCard.dataset.specs ? productCard.dataset.specs.split('|') : this.getProductSpecs(productName);

    return {
      name: productName,
      price: productPrice,
      description: productDescription,
      specs: productSpecs,
      image: productImage
    };
  }

  attachAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-btn, .add-to-cart-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
          const productData = this.getProductData(productCard);
          let product = this.products.find(p => p.name === productData.name);
          if (!product) {
            product = { id: Date.now(), ...productData };
          }
          
          this.addToCart(product);
          this.showNotification('Added to cart!');
        }
      });
    });

    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;

        const productData = this.getProductData(productCard);
        localStorage.setItem('sharkawySelectedProduct', JSON.stringify(productData));
        window.location.href = 'product.html';
      });
    });
  }

  addToCart(product) {
    const quantityToAdd = Number(product.quantity) > 0 ? Number(product.quantity) : 1;
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantityToAdd;
    } else {
      this.cart.push({
        ...product,
        quantity: quantityToAdd
      });
    }
    
    this.saveCart();
    this.updateCartUI();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(p => p.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
      this.updateCartUI();
    }
  }

  saveCart() {
    localStorage.setItem('sharkawyCart', JSON.stringify(this.cart));
  }

  updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartCount) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  formatCurrency(value) {
    return `${value.toFixed(2)} EGP`;
  }

  getCartItems() {
    return this.cart;
  }

  async checkout() {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const name = prompt('Enter your full name:');
    const email = prompt('Enter your email address:');
    const phone = prompt('Enter your phone number:');
    const address = prompt('Enter your delivery address:');
    const total = this.getCartTotal();

    if (!name || !email || !phone || !address) {
      alert('Order cancelled. All customer details are required.');
      return;
    }

    const paymentMessage = `Payment method: Vodafone Cash\nSend ${this.formatCurrency(total)} to: 01092563878\nAfter sending, keep your transfer confirmation.`;
    if (!confirm(`${paymentMessage}\n\nPress OK after you understand the payment instructions.`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/email/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, email, phone, address },
          items: this.cart,
          total,
          paymentMethod: 'Vodafone Cash',
          paymentNumber: '01092563878'
        })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Could not send order.');

      alert('Your order request was sent successfully. Send the payment to Vodafone Cash number 01092563878, then we will confirm your order.');
      this.cart = [];
      this.saveCart();
      this.updateCartUI();
      this.displayCart();
    } catch (error) {
      alert(`Could not send your order: ${error.message}`);
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  attachEventListeners() {
    // Cart toggle
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.querySelector('.close-cart');

    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        this.displayCart();
        cartModal.style.display = 'block';
      });
    }

    if (closeCart) {
      closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.style.display = 'none';
      }
    });
  }

  displayCart() {
    const cartList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartList) return;

    cartList.innerHTML = '';
    
    if (this.cart.length === 0) {
      cartList.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
      if (cartTotal) cartTotal.textContent = '0.00 EGP';
      return;
    }

    this.cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-image">
          ${item.image.includes('<') ? item.image : `<img src="${item.image}" alt="${item.name}">`}
        </div>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="item-price">${this.formatCurrency(item.price)}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <input type="number" value="${item.quantity}" readonly>
          <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">
          ${this.formatCurrency(item.price * item.quantity)}
        </div>
        <button class="remove-btn" onclick="cart.removeFromCart(${item.id})">🗑️</button>
      `;
      cartList.appendChild(cartItem);
    });

    if (cartTotal) {
      const total = this.getCartTotal();
      cartTotal.textContent = this.formatCurrency(total);
    }
  }
}

// Image Slider
class ImageSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentSlide = 0;
    this.slides = [];
    this.slideImages = [
      {
        image: 'iphone 16 pro.jpeg',
        title: 'iPhone 16 Pro',
        price: '999 EGP',
        link: '#'
      },
      {
        image: 'iphone-17-pro.webp',
        title: 'iPhone 17 Pro',
        price: '1,299 EGP',
        link: '#'
      },
      {
        image: 'iphone 17.jpg',
        title: 'iPhone 17',
        price: '1,099 EGP',
        link: '#'
      },
      {
        image: 'iphone 16.webp',
        title: 'iPhone 16',
        price: '799 EGP',
        link: '#'
      }
    ];
    
    if (this.container) {
      this.initializeSlider();
    }
  }

  initializeSlider() {
    this.buildSliderHTML();
    this.attachEventListeners();
    this.autoSlide();
  }

  buildSliderHTML() {
    this.container.innerHTML = `
      <div class="slider-wrapper">
        <div class="slider-track">
          ${this.slideImages.map(item => `
            <div class="slide">
              <div class="slide-content">
                <img src="${item.image}" alt="${item.title}">
                <div class="slide-info">
                  <h3>${item.title}</h3>
                  <p class="slide-price">${item.price}</p>
                  <a href="${item.link}" class="slide-link">View Details →</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <button class="slider-btn prev" data-action="prev">❮</button>
        <button class="slider-btn next" data-action="next">❯</button>
        <div class="slider-dots">
          ${this.slideImages.map((_, i) => `
            <span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
          `).join('')}
        </div>
      </div>
    `;

    this.slides = this.container.querySelectorAll('.slide');
  }

  attachEventListeners() {
    const prevBtn = this.container.querySelector('.slider-btn.prev');
    const nextBtn = this.container.querySelector('.slider-btn.next');
    const dots = this.container.querySelectorAll('.dot');

    prevBtn.addEventListener('click', () => this.prevSlide());
    nextBtn.addEventListener('click', () => this.nextSlide());
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        this.currentSlide = parseInt(e.target.dataset.index);
        this.updateSlider();
      });
    });
  }

  updateSlider() {
    const offset = -this.currentSlide * 100;
    this.container.querySelector('.slider-track').style.transform = `translateX(${offset}%)`;
    
    this.container.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentSlide);
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlider();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateSlider();
  }

  autoSlide() {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}

// Initialize cart and slider when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize shopping cart
  window.cart = new ShoppingCart();
  
  // Initialize slider on home page
  const slider = new ImageSlider('hero-slider');
});
