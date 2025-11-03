import React, { useState } from 'react';
import { User, Lock, Trash2, Save, AlertCircle } from 'lucide-react';
import type { IUser } from '../../interfaces/user';
import Button from './Button';

interface UserProfileSettingsProps {
  user: IUser;
  onUpdateUser: (updates: { 
    firstname: string; 
    lastname: string; 
    password?: string; 
    currentPassword?: string 
  }) => Promise<void>;
  onDeleteUser: (password: string) => Promise<void>;
}

/**
 * Composant de gestion du profil utilisateur
 * Permet de modifier les infos personnelles, le mot de passe et supprimer le compte
 */
const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  user,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'danger'>('info');
  const [loading, setLoading] = useState(false); // État global de chargement
  const [error, setError] = useState<string>(''); // Message d'erreur
  const [success, setSuccess] = useState<string>(''); // Message de succès

  // États du formulaire "Informations personnelles"
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);

  // États du formulaire "Mot de passe"
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // États du formulaire "Suppression de compte"
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Réinitialise les messages d'erreur et de succès
   */
  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  /**
   * Met à jour les informations personnelles (prénom, nom)
   */
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!firstname.trim() || !lastname.trim()) {
      setError('Le prénom et le nom sont obligatoires');
      return;
    }

    setLoading(true);
    try {
      await onUpdateUser({ firstname, lastname });
      setSuccess('Profil mis à jour avec succès !');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Échec de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change le mot de passe de l'utilisateur
   * Vérifie la longueur, la correspondance et le mot de passe actuel
   */
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!currentPassword) {
      setError('Le mot de passe actuel est requis');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await onUpdateUser({
        firstname: user.firstname,
        lastname: user.lastname,
        password: newPassword,
        currentPassword,
      });
      setSuccess('Mot de passe mis à jour avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Échec de la mise à jour. Vérifiez votre mot de passe actuel.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Supprime définitivement le compte utilisateur
   * Demande le mot de passe pour confirmation
   */
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Veuillez entrer votre mot de passe pour confirmer la suppression');
      return;
    }

    setLoading(true);
    try {
      await onDeleteUser(deletePassword);
      // La redirection ou déconnexion est gérée par le parent
    } catch (err: any) {
      setError(err.response?.data?.message || 'Échec de la suppression. Vérifiez votre mot de passe.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* === Onglets de navigation === */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setActiveTab('info');
              resetMessages();
            }}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <User size={16} className="inline mr-2" />
            Informations personnelles
          </button>
          <button
            onClick={() => {
              setActiveTab('password');
              resetMessages();
            }}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'password'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Lock size={16} className="inline mr-2" />
            Mot de passe
          </button>
          <button
            onClick={() => {
              setActiveTab('danger');
              resetMessages();
              setShowDeleteConfirm(false);
            }}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'danger'
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Trash2 size={16} className="inline mr-2" />
            Zone dangereuse
          </button>
        </div>
      </div>

      {/* === Messages d'erreur et de succès === */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-green-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {/* === Onglet : Informations personnelles === */}
      {activeTab === 'info' && (
        <form onSubmit={handleUpdateInfo} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">L'email ne peut pas être modifié</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Save size={16} className="mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      )}

      {/* === Onglet : Mot de passe === */}
      {activeTab === 'password' && (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe actuel *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nouveau mot de passe *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              minLength={8}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 8 caractères</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmer le nouveau mot de passe *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Lock size={16} className="mr-2" />
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </Button>
          </div>
        </form>
      )}

      {/* === Onglet : Zone dangereuse === */}
      {activeTab === 'danger' && (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              Supprimer le compte
            </h4>
            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
              Une fois votre compte supprimé, il n’y a pas de retour en arrière. Toutes vos données seront perdues définitivement.
            </p>

            {/* Bouton pour déclencher la confirmation */}
            {!showDeleteConfirm ? (
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 size={16} className="mr-2" />
                Supprimer le compte
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Entrez votre mot de passe pour confirmer :
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword('');
                      resetMessages();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {loading ? 'Suppression...' : 'Confirmer la suppression'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileSettings;