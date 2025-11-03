import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addChapter, updateChapter } from '../../api/chapters';
import Button from '../common/Button';
import type { CreateChapterDto, UpdateChapterDto, IChapter } from '../../interfaces/chapter';
import { toast } from 'react-toastify';
import { FileText } from 'lucide-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

/**
 * Schéma de validation Zod pour la création d'un chapitre
 * Title : minimum 5 caractères, courseId : requis, content : optionnel
 */
const createChapterSchema = z.object({
  title: z.string().min(5, 'Minimum 5 characters (excluding spaces)'),
  courseId: z.string().min(1, 'Course ID is required'),
  content: z.string().optional(),
});

/**
 * Schéma de validation Zod pour la mise à jour d'un chapitre
 * Tous les champs optionnels, avec validation conditionnelle sur title
 */
const updateChapterSchema = z.object({
  title: z.string().optional().refine((val) => !val || val.trim().length >= 5, {
    message: 'Minimum 5 characters (excluding spaces)',
  }),
  courseId: z.string().optional(),
  content: z.string().optional(),
});

/**
 * Schéma unifié pour création et mise à jour (union des deux schémas)
 * Permet d'utiliser un seul resolver dans useForm
 */
const chapterSchema = z.union([createChapterSchema, updateChapterSchema]);

type ChapterFormData = CreateChapterDto | UpdateChapterDto;

interface ChapterFormProps {
  courseId: string; // ID du cours associé au chapitre
  chapter?: IChapter; // Chapitre existant pour mode édition (optionnel)
  onSuccess: () => void; // Callback après succès (fermeture, rafraîchissement, etc.)
}

/**
 * Composant de formulaire pour créer ou éditer un chapitre
 * Intègre React Hook Form pour la gestion, Zod pour la validation
 * et Quill pour l'éditeur riche de contenu
 */
const ChapterForm: React.FC<ChapterFormProps> = ({ courseId, chapter, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema), // Validation dynamique via union de schémas
    mode: 'onChange', // Validation en temps réel
    defaultValues: chapter
      ? { title: chapter.title, courseId: chapter.courseId, content: chapter.content }
      : { courseId, title: '', content: '' }, // Valeurs par défaut selon mode
  });

  const editorRef = useRef<HTMLDivElement>(null); // Référence au conteneur Quill
  const quillRef = useRef<Quill | null>(null); // Instance de l'éditeur Quill
  const content = watch('content'); // Surveille les changements de contenu

  /**
   * Initialise l'éditeur Quill au montage du composant
   * Configure la toolbar et synchronise avec le formulaire
   */
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow', // Thème par défaut avec toolbar
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }], // Headers
            ['bold', 'italic', 'underline', 'strike'], // Formatage texte
            [{ color: [] }, { background: [] }], // Couleurs
            [{ list: 'ordered' }, { list: 'bullet' }], // Listes
            [{ indent: '-1' }, { indent: '+1' }], // Indentation
            ['link', 'image'], // Liens et images
            ['clean'], // Nettoyage format
          ],
        },
        placeholder: 'Write your chapter content with formatting...',
      });

      // Restaure le contenu existant si présent
      if (content) {
        quill.root.innerHTML = content;
      }

      // Synchronise les changements avec le formulaire
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        setValue('content', html === '<p><br></p>' ? '' : html); // Évite le HTML vide
        trigger('content'); // Re-valide le champ
      });

      quillRef.current = quill;
    }
  }, []); // Dépendance vide : exécution une seule fois au montage

  /**
   * Synchronise le contenu du formulaire avec Quill (pour reset ou changements externes)
   */
  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content || '';
    }
  }, [content]); // Dépend de content pour mise à jour

  /**
   * Gère la soumission du formulaire
   * Appelle l'API de création ou mise à jour selon le mode
   */
  const onSubmit = async (data: ChapterFormData) => {
    try {
      if (chapter) {
        // Mode édition : mise à jour
        await updateChapter(chapter.uuid, data as UpdateChapterDto);
      } else {
        // Mode création : ajout
        await addChapter({ ...data, courseId } as CreateChapterDto);
      }
      onSuccess(); // Appelle le callback de succès
    } catch (error) {
      toast.error('Failed to save chapter'); // Notification d'erreur
    }
  };

  /**
   * Utilitaire pour les classes de bordure (erreur vs focus normal)
   */
  const getBorderClass = (hasError: boolean) =>
    hasError ? '!border-red-500 !ring-red-500 ring-2' : 'border-gray-300 dark:border-gray-600 ring-blue-500';

  return (
    <div className="relative max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Bandeau décoratif en haut */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
      
      {/* Formulaire principal */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

        {/* === Champ Titre === */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chapter Title
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('title')} // Enregistrement avec React Hook Form
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 ${getBorderClass(!!errors.title)}`}
              placeholder="Enter chapter title"
            />
          </div>
          {/* Affichage des erreurs de validation */}
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* === Éditeur de Contenu Riche === */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <div className={`border-2 rounded-lg overflow-hidden bg-white dark:bg-gray-700 transition-all duration-200 ${getBorderClass(!!errors.content)}`}>
            {/* Conteneur de l'éditeur Quill */}
            <div ref={editorRef} className="h-64" style={{ minHeight: '256px' }} />
          </div>
          {/* Affichage des erreurs de validation */}
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* === Bouton de Soumission === */}
        <Button
          type="submit"
          disabled={isSubmitting || !isValid} // Désactivé si en cours ou invalide
          className={`w-full flex items-center justify-center gap-2 font-medium rounded-lg py-3 transition-all duration-200 shadow-md hover:shadow-lg ${
            isValid && !isSubmitting
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          <FileText size={20} />
          {isSubmitting ? 'Saving...' : chapter ? 'Update Chapter' : 'Create Chapter'}
        </Button>
      </form>
    </div>
  );
};

export default ChapterForm;