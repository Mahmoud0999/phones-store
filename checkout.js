const API_URL = 'http://localhost:5000/api/email/order';

const formatCurrency = (value) => `${Number(value).toFixed(2)} EGP`;

const renderOrder = (cart) => {
  const itemsContainer = document.getElementById('checkout-items');
  const totalElement = document.getElementById('checkout-total-value');
  const total = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

  cart.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'checkout-item';
    itemElement.innerHTML = `
      <div class="checkout-item-image"><img src="${item.image}" alt=""></div>
      <div class="checkout-item-info">
        <strong></strong>
        <span>Quantity: ${Number(item.quantity)}</span>
      </div>
      <strong>${formatCurrency(Number(item.price) * Number(item.quantity))}</strong>
    `;
    itemElement.querySelector('.checkout-item-info strong').textContent = item.name;
    itemsContainer.appendChild(itemElement);
  });

  totalElement.textContent = formatCurrency(total);
  return total;
};

document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('sharkawyCart') || '[]');
  const checkoutLayout = document.getElementById('checkout-layout');
  const emptyCheckout = document.getElementById('empty-checkout');
  const form = document.getElementById('checkout-form');
  const submitButton = document.getElementById('submit-order');
  const errorElement = document.getElementById('checkout-error');
  const successElement = document.getElementById('checkout-success');

  if (cart.length === 0) {
    checkoutLayout.hidden = true;
    emptyCheckout.hidden = false;
    return;
  }

  const total = renderOrder(cart);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorElement.hidden = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending request...';

    const formData = new FormData(form);
    const customer = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      phone: formData.get('phone').trim(),
      address: formData.get('address').trim()
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: cart,
          total,
          paymentMethod: 'Vodafone Cash',
          paymentNumber: '01092563878'
        })
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Could not send order request.');

      localStorage.removeItem('sharkawyCart');
      form.hidden = true;
      successElement.hidden = false;
    } catch (error) {
      errorElement.textContent = error.message === 'Failed to fetch'
        ? 'The order server is not running. Start the backend on port 5000 and try again.'
        : error.message;
      errorElement.hidden = false;
      submitButton.disabled = false;
      submitButton.textContent = 'Send order request';
    }
  });
});
