const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const API_ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/auth/register/`,
  LOGIN: `${BASE_URL}/auth/login/`,
  TOKEN_REFRESH: `${BASE_URL}/auth/refresh/`,

  // User
  PROFILE: `${BASE_URL}/user/info/`,
  CHANGE_PIECE: `${BASE_URL}/user/change-piece/`,
  USER_NAME_PIECE: `${BASE_URL}/info/user-name-piece/`, 

  // Shop
  SHOP_ITEMS: `${BASE_URL}/shop/items/`,
  SHOP_BUY: `${BASE_URL}/shop/buy/`,
  USER_PIECES: `${BASE_URL}/shop/user-pieces/`,
  USER_EMOJIS: `${BASE_URL}/shop/user-emojis/`,

  // Lobby
  GET_PRIVATE_CODE: `${BASE_URL}/lobby/get-private-code`
};

export default API_ENDPOINTS;
