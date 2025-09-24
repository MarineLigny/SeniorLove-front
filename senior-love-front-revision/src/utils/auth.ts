import axios from 'axios';

const api = axios.create({
  baseURL: 'https://seniorlove-back-znlu.onrender.com',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Service d'authentification
export const authService = {
  // Vérifie si l'utilisateur est authentifié
  isAuthenticated() {
    return localStorage.getItem('accessToken') !== null;
  },

  // Récupère le token actuel
  getToken() {
    return localStorage.getItem('accessToken');
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_id');
    localStorage.removeItem('pseudo');
  },
};

// Intercepteur de requête pour ajouter automatiquement le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse pour gérer le refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/refresh-token') {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Token expiré, refresh en cours...');
        const response = await api.post('/refresh-token');
        const newToken = response.data.token;

        // IMPORTANT : Sauvegarder le nouveau token
        localStorage.setItem('accessToken', newToken);

        // IMPORTANT : Mettre à jour l'header de la requête originale
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        console.log('✅ Token refreshed, nouvelle tentative');
        processQueue(null, newToken);
        isRefreshing = false;

        return api(originalRequest);

      } catch (refreshError) {
        console.log('❌ Refresh échoué, déconnexion');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user_id');
        localStorage.removeItem('pseudo');
        processQueue(refreshError, null);
        isRefreshing = false;

        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;