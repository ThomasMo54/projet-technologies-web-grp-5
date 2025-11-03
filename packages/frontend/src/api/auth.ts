import api from './axios';
import type { IUser } from '../interfaces/user';
import { jwtDecode } from 'jwt-decode'; 

interface LoginResponse {
  access_token: string;
}

// Structure du payload JWT décodé
interface JwtPayload {
  email: string;
  sub: string; // ID utilisateur
  type: 'teacher' | 'student';
  firstname?: string;
  lastname?: string;
  iat?: number; // Date de création du token
  exp?: number; // Date d'expiration du token
}

export interface SignupData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  type: 'teacher' | 'student';
}

/**
 * Authentifie un utilisateur et décode le JWT pour extraire les données utilisateur
 * @returns Token JWT et objet utilisateur décodé
 */
export const login = async (email: string, password: string): Promise<{ token: string; user: IUser }> => {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  const { access_token } = response.data;
  
  // Décoder le JWT pour extraire les informations utilisateur
  const decoded = jwtDecode<JwtPayload>(access_token);

  const user: IUser = {
    id: decoded.sub,
    email: decoded.email,
    firstname: decoded.firstname || '',
    lastname: decoded.lastname || '',
    type: decoded.type,
  };

  return { token: access_token, user };
};

/**
 * Crée un compte utilisateur puis connecte automatiquement l'utilisateur
 */
export const signup = async (data: SignupData): Promise<{ token: string; user: IUser }> => {
  await api.post('/users', data);
  // Auto-login après inscription
  return login(data.email, data.password);
};