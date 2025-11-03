import React from 'react';

interface ButtonProps {
  children: React.ReactNode; // Contenu du bouton (texte, icône, etc.)
  onClick?: () => void; // Fonction appelée au clic
  className?: string; // Classes Tailwind supplémentaires
  type?: 'button' | 'submit' | 'reset'; // Type HTML du bouton
  disabled?: boolean; // Désactive le bouton
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; // Style du bouton
  size?: 'sm' | 'md' | 'lg'; // Taille du bouton
}

/**
 * Composant Button réutilisable et stylisé
 * Supporte plusieurs variantes de couleurs, tailles et états
 * Utilise Tailwind CSS pour un design moderne et cohérent
 */
const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  type = 'button', 
  disabled = false,
  variant = 'primary',
  size = 'md'
}) => {
  // Styles de base communs à tous les boutons
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Styles par variante (couleur et effet au survol)
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm hover:shadow focus:ring-gray-400',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg focus:ring-red-500',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg focus:ring-green-500'
  };
  
  // Styles par taille (padding et police)
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    // Bouton avec classes combinées
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;