import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, User, GraduationCap, BookOpen } from 'lucide-react';

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  type: 'teacher' | 'student';
}

const SignupPage: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    defaultValues: {
      type: 'student'
    }
  });
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const password = watch('password');
  const userType = watch('type');

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (value.length > 50) {
      return 'Le mot de passe ne peut pas dépasser 50 caractères';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Le mot de passe doit contenir au moins une majuscule';
    }
    if (!/[a-z]/.test(value)) {
      return 'Le mot de passe doit contenir au moins une minuscule';
    }
    if (!/[0-9]/.test(value)) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    return true;
  };

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const { token, user } = await signup({
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        type: data.type
      });
      
      // Stocker le token JWT (access_token)
      localStorage.setItem('token', token);
      setUser(user);
      toast.success('Compte créé avec succès !');
      navigate(user.type === 'teacher' ? '/teacher/courses' : '/student/courses');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 w-full py-8">
      <div className="relative w-full max-w-2xl mx-auto p-4 sm:p-0">
        {/* Gradient Header */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
        
        <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Logo & Title */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <UserPlus className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Créer un compte</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Je suis un(e)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    userType === 'student'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="student"
                    {...register('type', { required: true })}
                    className="sr-only"
                  />
                  <GraduationCap className={userType === 'student' ? 'text-blue-500' : 'text-gray-400'} size={24} />
                  <span className={`ml-2 font-medium ${userType === 'student' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    Étudiant
                  </span>
                </label>

                <label
                  className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    userType === 'teacher'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="teacher"
                    {...register('type', { required: true })}
                    className="sr-only"
                  />
                  <BookOpen className={userType === 'teacher' ? 'text-purple-500' : 'text-gray-400'} size={24} />
                  <span className={`ml-2 font-medium ${userType === 'teacher' ? 'text-purple-700 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    Enseignant
                  </span>
                </label>
              </div>
            </div>

            {/* Name Inputs - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...register('firstname', {
                      required: 'Le prénom est requis',
                      maxLength: { value: 50, message: 'Le prénom ne peut pas dépasser 50 caractères' }
                    })}
                    id="firstname"
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.firstname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="John"
                  />
                </div>
                {errors.firstname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstname.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...register('lastname', {
                      required: 'Le nom est requis',
                      maxLength: { value: 50, message: 'Le nom ne peut pas dépasser 50 caractères' }
                    })}
                    id="lastname"
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.lastname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastname.message}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  id="email"
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="exemple@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Inputs - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...register('password', {
                      required: 'Le mot de passe est requis',
                      validate: validatePassword
                    })}
                    id="password"
                    type="password"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...register('confirmPassword', {
                      required: 'Veuillez confirmer votre mot de passe',
                      validate: value => value === password || 'Les mots de passe ne correspondent pas'
                    })}
                    id="confirmPassword"
                    type="password"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs text-blue-800 dark:text-blue-300 font-medium mb-2">Le mot de passe doit contenir :</p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Au moins 8 caractères (max 50)</li>
                <li>• Une lettre majuscule</li>
                <li>• Une lettre minuscule</li>
                <li>• Un chiffre</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg py-3 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Se connecter
              </a>
            </p>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-xl transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default SignupPage;