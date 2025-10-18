import React, { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import type { IComment } from '../../interfaces/comment';
import { addComment, deleteComment, fetchUserById } from '../../api/comments';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import { MessageCircle, Send, User, Smile, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface CommentListProps {
  comments: IComment[];
  courseId: string;
}

const CommentItem: React.FC<{
  comment: IComment;
  userId: string;
  onDelete: (commentId: string, commentUserId: string) => void;
  deletingId: string | null;
}> = ({ comment, userId, onDelete, deletingId }) => {
  const { data: commentAuthor } = useQuery({
    queryKey: ['user', comment.userId],
    queryFn: () => fetchUserById(comment.userId),
  });

  const isOwnComment = comment.userId === userId;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1 justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {commentAuthor?.firstname} {commentAuthor?.lastname}
                </span>
                {isOwnComment && (
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    Vous
                  </span>
                )}
              </div>
              {isOwnComment && (
                <button
                  onClick={() => onDelete(comment.uuid, comment.userId)}
                  disabled={deletingId === comment.uuid}
                  className="p-1 text-red-500 hover:text-red-600 disabled:opacity-50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Supprimer"
                >
                  {deletingId === comment.uuid ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              )}
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>
          <div className="flex items-center mt-2 px-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentList: React.FC<CommentListProps> = ({ comments, courseId }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const userId = user?.id;

  if (!userId) {
    return <p className="text-gray-500">Connectez-vous pour commenter.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(courseId, newComment.trim(), userId);
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] });
      toast.success('Commentaire ajouté!');
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Vous ne pouvez créer que vos propres commentaires');
      } else {
        toast.error('Échec de l\'ajout du commentaire');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string, commentUserId: string) => {
    if (commentUserId !== userId) {
      toast.error('Vous ne pouvez supprimer que vos propres commentaires');
      return;
    }

    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?');
    if (!isConfirmed) return;

    setDeletingId(commentId);
    try {
      await deleteComment(commentId);
      queryClient.invalidateQueries({ queryKey: ['comments', courseId] });
      toast.success('Commentaire supprimé !');
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Vous ne pouvez supprimer que vos propres commentaires');
      } else if (error.response?.status === 404) {
        toast.error('Commentaire introuvable');
      } else {
        toast.error('Échec de la suppression');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrire un commentaire..."
                rows={1}
                className="w-full px-4 py-3 pr-24 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200 resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title="Emoji"
                >
                  <Smile size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="p-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-200"
                  title="Envoyer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send size={18} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.uuid}
              comment={comment}
              userId={userId}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <MessageCircle size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              Aucun commentaire pour le moment
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Soyez le premier à commenter ce cours!
            </p>
          </div>
        )}
      </div>

      {comments.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {comments.length} commentaire{comments.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentList;