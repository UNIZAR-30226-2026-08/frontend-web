import API_ENDPOINTS from './apiEndpoints.js';

export const fetchShopItems = async (accessToken, updateShopItems) => {
  try {
    const response = await fetch(API_ENDPOINTS.SHOP_ITEMS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("shopitems", data);
    if (updateShopItems) updateShopItems(data);
  } catch(error) {
    console.error('Error fetching shop items:', error);
  }
};

export const buyItem = async (accessToken, itemId, onSuccess, onError) => {
  try {
    const response = await fetch(API_ENDPOINTS.SHOP_BUY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ custom_id: itemId }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (onError) onError(data);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (onSuccess) onSuccess(data);
  } catch(error) {
    console.error('Error buying item:', error);
  }
};

export const fetchUserPieces = async (accessToken, updateUserPieces) => {
  try {
    const response = await fetch(API_ENDPOINTS.USER_PIECES, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("userpieces", data);
    if (updateUserPieces) updateUserPieces(data);
  } catch(error) {
    console.error('Error fetching user pieces:', error);
  }
};

export const fetchUserEmojis = async (accessToken, updateUserEmojis) => {
  try {
    const response = await fetch(API_ENDPOINTS.USER_EMOJIS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("useremojis", data);
    if (updateUserEmojis) updateUserEmojis(data);
  } catch(error) {
    console.error('Error fetching user emojis:', error);
  }
};
