/* =====================================================================
   DOLCE ORSO — SITE SETTINGS  (edit this file, no coding needed)
   ===================================================================== */
window.DOLCE_SETTINGS = {
  // Your WhatsApp number for orders: digits only, with country code, no "+".
  // Example for India: '919876543210'.  Leave '' until you have it - the
  // WhatsApp buttons will then open WhatsApp and let the customer pick a chat.
  whatsapp: '919399734130',

  // Shown on the Concierge / Contact page. Leave '' to hide.
  email: 'tejxshrivastava@gmail.com',
  phone: '+91 93997 34130',

  // Social links (full web addresses). Leave '' to keep the link inactive.
  social: {
    instagram: 'https://www.instagram.com/tejxshrivastva/',
    youtube: 'https://tejasshrivastava.com/',
    linkedin: 'https://www.linkedin.com/in/tejas-shrivastava/'
  },

  // ---- Customer sign-in (Google + mobile OTP) ----
  // Powered by Firebase (free to set up at console.firebase.google.com).
  // Create a project, add a Web app, copy its keys here. Then in the Firebase
  // console: Authentication > Sign-in method > turn on "Google" and "Phone".
  // Leave blank and the Sign in page shows a "not switched on yet" message.
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    appId: ''
  },

  // Photos shown (slowly rotating) on the Sign in and Concierge pages.
  // Use the "slug" of any products that have real photos (their background photo is used).
  authPhotos: ['flame-wide-jeans', 'cherry-blossom-wide-jeans', 'sunflower-cargo-jeans', 'butterfly-transformation-tee'],

  // Raise this number by 1 whenever you replace product photos, so every
  // visitor's browser downloads the new pictures instead of showing old ones.
  imageVersion: 25,

  // Hand-picked product lists for the Gift Guide and Most Loved pages.
  // Use the "slug" of each product from products.js.
  gifts: [
    'jackets-product-1', 'jackets-product-2', 'jackets-product-3', 'jackets-product-4',
    'category-5-product-1', 'category-5-product-2', 'category-5-product-4', 'category-5-product-10'
  ],
  mostLoved: [
    'asymmetric-flap-cargo-jeans', 'swirl-panel-wide-jeans', 'starboy-graphic-tee', 'crochet-mandala-tee',
    'embossed-crest-zip-hoodie', 'hoodies-product-2', 'jackets-product-1', 'category-5-product-1'
  ]
};
