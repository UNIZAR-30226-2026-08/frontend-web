const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register/',
  LOGIN: '/auth/login/',
  TOKEN_REFRESH: '/auth/refresh/',

  // User
  PROFILE: '/user/info/',
  CHANGE_PIECE: '/user/change-piece/',

  // Info
  USER_NAME_PIECE: '/info/user-name-piece/', 

  // Shop
  SHOP_ITEMS: '/shop/items/',
  SHOP_BUY: '/shop/buy/',
  USER_PIECES: '/shop/user-pieces/',
  USER_EMOJIS: '/shop/user-emojis/',

  // Lobby
  GET_PRIVATE_CODE: '/lobby/get-private-code'
};

export default API_ENDPOINTS;
