import React, { useState } from 'react';
import type { IComment } from '../../interfaces/comment';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CommentForm from '../forms/CommentForm';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import { PlusCircle } from 'lucide-react';

interface CommentListProps {
  comments: IComment[];
  courseId: string;
}

const CommentList: React.FC<CommentListProps> = ({ comments, courseId }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAdd = () => setAddModalOpen(true);
  const handleClose = () => setAddModalOpen(false);
  const handleSuccess = () => {
    handleClose();
    toast.success('Comment added!');
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleAdd}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-4 shadow-md hover:shadow-lg"
      >
        <PlusCircle size={20} />
        Add Comment
      </Button>
      <ul className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li
              key={comment.id}
              className="relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md"
            >
              <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
              <small className="text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</small>
              <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-300 pointer-events-none"></div>
            </li>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">No comments yet.</p>
        )}
      </ul>
      <Modal isOpen={addModalOpen} onClose={handleClose} title="Add Comment">
        <CommentForm courseId={courseId} onSuccess={handleSuccess} />
      </Modal>
    </div>
  );
};

export default CommentList;