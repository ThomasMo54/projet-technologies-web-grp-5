import api from './axios';
import type { IUser } from '../interfaces/user';

/**
 * Vérifie si le mot de passe actuel est correct en tentant une connexion
 * @returns true si le mot de passe est valide, false sinon
 */
export const verifyCurrentPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    await api.post('/auth/login', { email, password });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Met à jour les informations de l'utilisateur
 * Peut modifier le prénom, nom et/ou mot de passe
 */
export const updateUser = async (
  userId: string,
  updates: {
    firstname?: string;
    lastname?: string;
    password?: string;
  }
): Promise<IUser> => {
  const response = await api.put<IUser>(`/users/${userId}`, updates);
  return response.data;
};

/**
 * Supprime définitivement le compte utilisateur
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};