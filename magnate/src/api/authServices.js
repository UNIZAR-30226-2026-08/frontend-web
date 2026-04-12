import API_ENDPOINTS from './apiEndpoints.js';

export const registerUser = async (userData, onSuccess, onError) => {
  // userData = { username, email, password, password2 }
  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || data.detail || Object.values(data)[0]?.[0] || "Error al crear la cuenta";
      
      if (onError) onError(errorMessage);
      return;
      // if (onError) onError(data);
      //throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (onSuccess) onSuccess(data);
  } catch(error) {
    console.error('Error registering user:', error);
  }
};

export const loginUser = async (credentials, onSuccess, onError) => {
  // credentials = { username, password }
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorText = data.error || data.detail || Object.values(data)[0]?.[0] || "Error al entrar";
      const msg = errorText === 'bad credentials' ? "Usuario o contraseña incorrectos" : errorText;
      if (onError) onError(msg);
      // if (onError) onError(data);
      //throw new Error(`HTTP error! Status: ${response.status}`);
      return;
    }

    if (onSuccess) onSuccess(data);
  } catch(error) {
    console.error('Error logging in:', error);
  }
};

export const refreshToken = async (refreshTokenString, updateTokens) => {
  try {
    const response = await fetch(API_ENDPOINTS.TOKEN_REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshTokenString }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (updateTokens) updateTokens(data);
  } catch(error) {
    console.error('Error refreshing token:', error);
  }
};
