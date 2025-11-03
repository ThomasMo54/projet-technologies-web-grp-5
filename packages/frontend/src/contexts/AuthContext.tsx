import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IUser } from '../interfaces/user';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  updateAuthUser: (user: IUser) => void; // Met à jour les infos utilisateur dans le contexte
  logout: () => void;
  isLoading: boolean;
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restaure la session utilisateur depuis le token JWT au chargement de l'app
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        
        // Vérifier si le token n'est pas expiré
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          const userData: IUser = {
            id: decoded.sub,
            email: decoded.email,
            firstname: decoded.firstname || '',
            lastname: decoded.lastname || '',
            type: decoded.type,
          };
          setUser(userData);
        } else {
          // Token expiré, le supprimer
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Met à jour l'utilisateur connecté (après modification du profil)
   */
  const updateAuthUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  /**
   * Déconnecte l'utilisateur et nettoie le localStorage
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateAuthUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};