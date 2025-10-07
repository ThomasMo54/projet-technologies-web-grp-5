import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IUser } from '../interfaces/user';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
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
    // Vérifier si un token existe au chargement
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

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};