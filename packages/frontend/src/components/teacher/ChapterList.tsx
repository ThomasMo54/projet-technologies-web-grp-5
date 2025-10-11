import React, { useState } from 'react';
import type { IChapter } from '../../interfaces/chapter';
import Button from '../common/Button';
import Modal from '../common/Modal';
import ChapterForm from '../forms/ChapterForm';
import QuizSection from './QuizSection'; 
import { toast } from 'react-toastify';
import { deleteChapter } from '../../api/chapters';
import { useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';

interface ChapterListProps {
  chapters: IChapter[];
  courseId: string;
}

const ChapterList: React.FC<ChapterListProps> = ({ chapters, courseId }) => {
  const queryClient = useQueryClient();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<IChapter | null>(null);

  const handleEdit = (chapter: IChapter) => {
    setSelectedChapter(chapter);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;
    
    try {
      await deleteChapter(id);
      queryClient.invalidateQueries({ queryKey: ['chapters', courseId] });
      toast.success('Chapter deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete chapter');
    }
  };

  const handleClose = () => {
    setEditModalOpen(false);
    setSelectedChapter(null);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['chapters', courseId] });
    handleClose();
    toast.success('Chapter updated successfully!');
  };

  return (
    <>
      <ul className="space-y-4">
        {chapters.length > 0 ? (
          chapters.map((chapter) => (
            <li
              key={chapter.uuid}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {chapter.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {chapter.content || 'No content available'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <Button
                    onClick={() => handleEdit(chapter)}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg py-2 px-4"
                  >
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(chapter.uuid)}
                    className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg py-2 px-4"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
                
                {/* Quiz Section - Un seul quiz par chapitre */}
                <QuizSection courseId={courseId} chapterId={chapter.uuid} />
              </div>
              <div className="absolute inset-0 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 rounded-lg transition-all duration-300 pointer-events-none"></div>
            </li>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No chapters yet.</p>
          </div>
        )}
      </ul>
      
      <Modal isOpen={editModalOpen} onClose={handleClose} title="Edit Chapter">
        {selectedChapter && (
          <ChapterForm 
            courseId={courseId} 
            chapter={selectedChapter} 
            onSuccess={handleSuccess} 
          />
        )}
      </Modal>
    </>
  );
};

export default ChapterList;