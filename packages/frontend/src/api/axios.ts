import axios from 'axios';

// Récupère l'URL de l'API depuis les variables d'environnement
const baseURL = import.meta.env.VITE_API_URL;

// Instance Axios configurée pour communiquer avec le backend
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
