import axios from 'axios';

const API_BASE_URL = 'https://seniorlove.up.railway.app';

// Service d'authentification avec gestion des refresh tokens
export const authService = {
  // Demande un nouveau token avec le refresh token (cookie)
  async refreshToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/refresh-token`, {}, {
        withCredentials: true, // Inclut les cookies dans la requête
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data.token;
      }

      throw new Error('No token received');
    } catch (error) {
      // Si le refresh échoue, supprimer le token local
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('pseudo');
      throw error;
    }
  },

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  },

  // Récupère le token actuel
  getToken() {
    return localStorage.getItem('token');
  },

  // Déconnexion
  async logout() {
    try {
      // Appeler l'endpoint de déconnexion côté serveur pour supprimer le refresh token
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion côté serveur:', error);
    }

    // Nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('pseudo');
  },
};

// Intercepteur Axios pour gérer automatiquement le renouvellement des tokens
axios.interceptors.request.use(
  (config) => {
    // Ne pas ajouter le token pour les routes de login et register
    const isAuthRoute = config.url?.includes('/login') || config.url?.includes('/register');

    if (!isAuthRoute) {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Inclure les cookies pour les routes qui nécessitent le refresh token
    if (config.url?.includes('refresh-token') || config.url?.includes('logout') || config.url?.includes('login') || config.url?.includes('register')) {
      config.withCredentials = true;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer les erreurs 401 (token expiré)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ne pas tenter de refresh sur les routes d'auth
    const isAuthRoute = originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        // Essayer de renouveler le token
        console.log('Tentative de renouvellement du token...');
        const newToken = await authService.refreshToken();

        // Mettre à jour l'en-tête Authorization avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retenter la requête originale
        return axios(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, nettoyer et rediriger
        console.warn('Échec du renouvellement du token, déconnexion...', refreshError);
        authService.logout();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
