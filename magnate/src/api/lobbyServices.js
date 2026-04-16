import API_ENDPOINTS from './apiEndpoints.js';

export const generatePrivateCode = async (accessToken, updateCode) => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_PRIVATE_CODE, {
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
    if (updateCode) updateCode(data.code); 
  } catch(error) {
    console.error('Error generating private code:', error);
  }
};

export const checkPrivateCode = async (accessToken, roomCode) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.CHECK_PRIVATE_CODE}${roomCode}/`, {
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
    return data.exists;
    
  } catch(error) {
    console.error('Error checking private room code:', error);
    return false;
  }
};
