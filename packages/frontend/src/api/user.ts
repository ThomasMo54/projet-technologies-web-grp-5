import api from './axios';
import type { IUser } from '../interfaces/user';


// Vérifier le mot de passe actuel
export const verifyCurrentPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    await api.post('/auth/login', { email, password });
    return true;
  } catch (error) {
    return false;
  }
};

// Mettre à jour les informations de l'utilisateur
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

// Supprimer le compte utilisateur
export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};