import API_ENDPOINTS from './apiEndpoints.js';

export const fetchProfile = async (accessToken, updateProfile) => {
  try {
    const response = await fetch(API_ENDPOINTS.PROFILE, {
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
    console.log('profile',data);
    if (updateProfile) updateProfile(data);
  } catch(error) {
    console.error('Error fetching profile:', error);
  }
};

export const changeUserPiece = async (accessToken, pieceId, onSuccess) => {
  try {
    const response = await fetch(API_ENDPOINTS.CHANGE_PIECE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ custom_id: pieceId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    if (onSuccess) onSuccess(data);
  } catch(error) {
    console.error('Error changing user piece:', error);
  }
};

export const fetchUserNamePiece = async (pk, updateNamePiece) => {
  // Al parecer este endpoint is AllowAny, no se necesita token (si no cambia el backend xd)
  try {
    const url = `${API_ENDPOINTS.USER_NAME_PIECE}${pk}/`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    if (updateNamePiece) updateNamePiece(data);
  } catch(error) {
    console.error('Error fetching user name piece:', error);
  }
};
