// 🔗 URLs
export const SITE_URL = "https://frustrationmagazine.fr";
export const LOCAL_SITE_URL = "http://localhost:4321";
export const OG_IMAGES_URL = `${SITE_URL}/img/og`;

// 🎯 Data
export const SUBSCRIBERS_TARGET = 5000;

// 📦 Headers
export const JSON_HEADERS = {
  "Content-Type": "application/json",
} as const;

// ✅ API endpoints
export const API_ENDPOINTS = {
  createCustomer: "/api/create-customer",
  createSubscription: "/api/create-subscription",
  createPaymentIntent: "/api/create-payment-intent",
  updatePaymentIntent: "/api/update-payment-intent",
} as const;
