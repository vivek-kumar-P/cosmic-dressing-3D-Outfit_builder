// Centralized route definitions
export const ROUTES = {
  // Public routes
  HOME: "/",
  GALLERY: "/gallery",
  PRODUCTS: "/products",

  // Auth routes
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Protected routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  PROFILE_SETTINGS: "/profile/settings",
  ORDERS: "/orders",

  // Shopping routes
  CUSTOMIZE: "/customize",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation",

  // Studio routes
  OUTFIT_PICKER: "/outfit-picker",

  // API routes
  API: {
    AUTH: "/api/auth",
    PRODUCTS: "/api/products",
    OUTFITS: "/api/outfits",
    CART: "/api/cart",
    ORDERS: "/api/orders",
  },
} as const

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.PROFILE_SETTINGS,
  ROUTES.CART,
  ROUTES.CHECKOUT,
  ROUTES.ORDERS,
  ROUTES.ORDER_CONFIRMATION,
] as const

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const
