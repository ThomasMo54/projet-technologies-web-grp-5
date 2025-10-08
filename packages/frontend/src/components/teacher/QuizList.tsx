import React, { useState } from 'react';
import type { IQuiz } from '../../interfaces/quiz';
import Button from '../common/Button';
import Modal from '../common/Modal';
import QuizForm from '../forms/QuizForm';
import { toast } from 'react-toastify';
import { deleteQuiz } from '../../api/quizzes';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface QuizListProps {
  quizzes: IQuiz[];
  courseId: string;
  chapterId: string;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, courseId, chapterId }) => {
  const queryClient = useQueryClient();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);

  const handleAdd = () => setAddModalOpen(true);
  const handleEdit = (quiz: IQuiz) => {
    setSelectedQuiz(quiz);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuiz(id);
      queryClient.invalidateQueries({ queryKey: ['quizzes', chapterId] });
      toast.success('Quiz deleted!');
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  const handleCloseAdd = () => setAddModalOpen(false);
  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setSelectedQuiz(null);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['quizzes', chapterId] });
    handleCloseAdd();
    handleCloseEdit();
    toast.success('Quiz updated/added!');
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-md font-semibold text-gray-900 dark:text-white">Quizzes</h5>
        <Button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg py-2 px-4 shadow-md hover:shadow-lg"
        >
          <PlusCircle size={16} />
          Add Quiz
        </Button>
      </div>
      <ul className="space-y-2">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <li
              key={quiz.uuid}
              className="relative p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex justify-between items-center transition-all duration-200 hover:shadow-md"
            >
              <span className="text-gray-800 dark:text-gray-200">{quiz.title}</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(quiz)}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg py-1 px-3 text-sm"
                >
                  <Edit size={14} />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(quiz.uuid)}
                  className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg py-1 px-3 text-sm"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
              <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-300 pointer-events-none"></div>
            </li>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">No quizzes yet.</p>
        )}
      </ul>
      <Modal isOpen={addModalOpen} onClose={handleCloseAdd} title="Add Quiz">
        <QuizForm courseId={courseId} chapterId={chapterId} onSuccess={handleSuccess} />
      </Modal>
      <Modal isOpen={editModalOpen} onClose={handleCloseEdit} title="Edit Quiz">
        {selectedQuiz && <QuizForm courseId={courseId} chapterId={chapterId} quiz={selectedQuiz} onSuccess={handleSuccess} />}
      </Modal>
    </div>
  );
};

export default QuizList;