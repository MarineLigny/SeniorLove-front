import axios from 'axios';

// Configuration de l'API avec refresh automatique
const api = axios.create({
  baseURL: 'https://seniorlove.up.railway.app/',
  withCredentials: true, // Important pour les cookies
});

// Service d'authentification
export const authService = {
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
      await api.post('/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion côté serveur:', error);
    }

    // Nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('pseudo');
  },
};

// Intercepteur pour ajouter le token à chaque requête
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

    // Inclure les cookies pour toutes les requêtes (refresh token)
    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour refresh automatique
axios.interceptors.response.use(
  (response) => response, // Si succès, passer
  async (error) => {
    const originalRequest = error.config;

    // Ne pas tenter de refresh sur les routes d'auth
    const isAuthRoute = originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register');

    // Si 401 et pas déjà tenté un refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        // Tenter le refresh
        console.log('Tentative de refresh token...');
        await api.post('/refresh-token');

        // Rejouer la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → vraie déconnexion
        console.warn('Refresh token échoué, déconnexion...', refreshError);
        authService.logout();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Exporter l'instance api configurée
export default api;