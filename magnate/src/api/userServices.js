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
    console.log('token',accessToken);
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

export const fetchGamesPlayed = async (accessToken, updateGamesPlayed) => {
  try {
    const response = await fetch(API_ENDPOINTS.GAMES_PLAYED, {
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
    console.log(data);
    if (updateGamesPlayed) updateGamesPlayed(data);
  } catch(error) {
    console.error('Error fetching games played:', error);
  }
};

export const fetchGameSummary = async (accessToken, gameId, updateSummary) => {
  try {
    const url = `${API_ENDPOINTS.GAME_SUMMARY}${gameId}/`;
    const response = await fetch(url, {
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
    console.log(data);
    if (updateSummary) updateSummary(data);
  } catch(error) {
    console.error('Error fetching game summary:', error);
  }
};
