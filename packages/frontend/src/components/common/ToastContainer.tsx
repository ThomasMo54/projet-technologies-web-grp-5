import React from 'react';
import { ToastContainer as ReactToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Composant de conteneur pour les notifications toast
 * Configure l'apparence, le comportement et la position des toasts dans l'application
 * Utilise react-toastify avec un style personnalisé
 */
const ToastContainer: React.FC = () => {
  return (
    <ReactToastContainer
      // Position des toasts sur la page
      position="top-center"

      // Durée d'affichage automatique (en ms)
      autoClose={3000}

      // Affiche la barre de progression
      hideProgressBar={false}

      // Les nouveaux toasts apparaissent au-dessus des anciens
      newestOnTop={true}

      // Ferme le toast en cliquant dessus
      closeOnClick

      // Désactive le mode RTL (écriture de droite à gauche)
      rtl={false}

      // Met en pause le timer quand la fenêtre perd le focus
      pauseOnFocusLoss

      // Permet de faire glisser le toast pour le fermer
      draggable

      // Met en pause le timer au survol
      pauseOnHover

      // Thème clair (light) - peut être "dark" ou "colored"
      theme="light"

      // === Style global du conteneur ===
      style={{
        marginTop: '20px', // Écarte les toasts du haut de l'écran
      }}

      // === Style individuel de chaque toast ===
      toastStyle={{
        borderRadius: '12px',           // Coins arrondis
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Ombre douce
        padding: '16px',                // Espacement interne
        fontSize: '14px',               // Taille de police
        fontWeight: '500',              // Police semi-gras
        minHeight: '64px',              // Hauteur minimale
      }}

      // === Bouton de fermeture personnalisé ===
      closeButton={({ closeToast }) => (
        <button
          onClick={closeToast}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#6b7280',             // Gris moyen
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',          // Rond au survol
            transition: 'all 0.2s ease',  // Animation fluide
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'; // Hover clair
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Fermer la notification"
        >
          x
        </button>
      )}
    />
  );
};

export default ToastContainer;