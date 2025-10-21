import api from './axios';
import type { IUser } from '../interfaces/user';
import { jwtDecode } from 'jwt-decode'; 

interface LoginResponse {
  access_token: string;
}

interface JwtPayload {
  email: string;
  sub: string;
  type: 'teacher' | 'student';
  firstname?: string;
  lastname?: string;
  iat?: number;
  exp?: number;
}

export interface SignupData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  type: 'teacher' | 'student';
}

export const login = async (email: string, password: string): Promise<{ token: string; user: IUser }> => {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  const { access_token } = response.data;
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

// Inscription
export const signup = async (data: SignupData): Promise<{ token: string; user: IUser }> => {
  // Créer l'utilisateur
  await api.post('/users', data);
  // Connexion automatique après inscription
  return login(data.email, data.password);
};