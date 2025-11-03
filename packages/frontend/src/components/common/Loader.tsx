import React from 'react';

/**
 * Composant Loader simple et réutilisable
 * Affiche un spinner de chargement centré
 * Utilisé pour indiquer un état de chargement (API, soumission, etc.)
 */
const Loader: React.FC = () => {
  return (
    // Conteneur centré horizontalement et verticalement
    <div className="flex justify-center items-center">
      {/* Spinner animé avec bordure bleue */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Loader;