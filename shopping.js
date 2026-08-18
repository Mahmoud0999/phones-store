// Shopping Cart Management System
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
      { id: 1, name: 'iPhone 16 Pro', price: 999, image: 'images/iphone 16 pro.jpeg', category: 'phones' },
      { id: 2, name: 'iPhone 16', price: 799, image: 'images/iphone 16.webp', category: 'phones' },
      { id: 3, name: 'iPhone 17', price: 1099, image: 'images/iphone 17.jpg', category: 'phones' },
      { id: 4, name: 'iPhone 17 Pro', price: 1299, image: 'images/iphone-17-pro.webp', category: 'phones' },
      { id: 5, name: 'Realme Phone', price: 499, image: 'images/realme.jpg', category: 'phones' },
      // Accessories
      { id: 6, name: 'AirPods Pro', price: 249, image: 'images/airpods.jpg', category: 'accessories' },
      { id: 7, name: 'Fast Charger', price: 49.99, image: 'images/charger.jpg', category: 'accessories' }
    ];
  }

  attachAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-btn, .add-to-cart-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
          const productName = productCard.querySelector('h3').textContent;
          const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
          const productImage = productCard.querySelector('.product-image img')?.src || productCard.querySelector('.product-image').textContent;
          
          // Find product by name
          let product = this.products.find(p => p.name === productName);
          if (!product) {
            product = { id: Date.now(), name: productName, price: productPrice, image: productImage };
          }
          
          this.addToCart(product);
          this.showNotification('Added to cart!');
        }
      });
    });
  }

  addToCart(product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
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

  getCartItems() {
    return this.cart;
  }

  checkout() {
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    const total = this.getCartTotal();
    alert(`Checkout successful! Total: $${total.toFixed(2)}\n\nThank you for shopping at Sharkawy Phones!`);
    this.cart = [];
    this.saveCart();
    this.updateCartUI();
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
      if (cartTotal) cartTotal.textContent = '$0.00';
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
          <p class="item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <input type="number" value="${item.quantity}" readonly>
          <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="remove-btn" onclick="cart.removeFromCart(${item.id})">🗑️</button>
      `;
      cartList.appendChild(cartItem);
    });

    if (cartTotal) {
      const total = this.getCartTotal();
      cartTotal.textContent = `$${total.toFixed(2)}`;
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
        image: 'images/iphone 16 pro.jpeg',
        title: 'iPhone 16 Pro',
        price: '$999',
        link: '#'
      },
      {
        image: 'images/iphone-17-pro.webp',
        title: 'iPhone 17 Pro',
        price: '$1,299',
        link: '#'
      },
      {
        image: 'images/iphone 17.jpg',
        title: 'iPhone 17',
        price: '$1,099',
        link: '#'
      },
      {
        image: 'images/iphone 16.webp',
        title: 'iPhone 16',
        price: '$799',
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
