/**
 * Razorpay Configuration Utility
 * Handles Razorpay integration for payment processing
 */

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay payment
 * @param {Object} options - Razorpay checkout options
 * @param {string} options.key - Razorpay Key ID
 * @param {number} options.amount - Amount in paise
 * @param {string} options.currency - Currency code
 * @param {string} options.orderId - Razorpay Order ID
 * @param {string} options.name - Business name
 * @param {string} options.description - Payment description
 * @param {Function} options.handler - Success callback
 * @param {Object} options.prefill - Auto-fill data
 * @returns {Promise<void>}
 */
export const initializeRazorpayCheckout = async (options) => {
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    throw new Error("Failed to load Razorpay script");
  }

  if (!window.Razorpay) {
    throw new Error("Razorpay SDK is not available");
  }

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      ...options,
      modal: {
        ondismiss: () => {
          reject(new Error("Payment modal closed"));
        },
      },
    });

    razorpay.open();
    resolve();
  });
};

/**
 * Verify Razorpay payment signature on backend
 * @param {Object} paymentData - Payment data from Razorpay
 * @returns {Promise<Object>} - Backend verification response
 */
export const verifyPaymentSignature = async (paymentData) => {
  const response = await fetch("/api/razorpay/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Payment verification failed");
  }

  return response.json();
};

/**
 * Create Razorpay order
 * @param {Object} orderData - Order creation data
 * @returns {Promise<Object>} - Order details
 */
export const createRazorpayOrder = async (orderData) => {
  const response = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create order");
  }

  return response.json();
};

/**
 * Get payment details from Razorpay
 * @param {string} paymentId - Razorpay Payment ID
 * @returns {Promise<Object>} - Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  const response = await fetch(`/api/razorpay/payment/${paymentId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch payment details");
  }

  return response.json();
};

/**
 * Get order details from Razorpay
 * @param {string} orderId - Razorpay Order ID
 * @returns {Promise<Object>} - Order details
 */
export const getOrderDetails = async (orderId) => {
  const response = await fetch(`/api/razorpay/order/${orderId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch order details");
  }

  return response.json();
};

/**
 * Format amount for Razorpay (rupees to paise)
 * @param {number} amount - Amount in rupees
 * @returns {number} - Amount in paise
 */
export const formatAmountForRazorpay = (amount) => {
  return Math.round(amount * 100);
};

/**
 * Parse amount from paise to rupees
 * @param {number} amountInPaise - Amount in paise
 * @returns {number} - Amount in rupees
 */
export const parseAmountFromRazorpay = (amountInPaise) => {
  return amountInPaise / 100;
};
