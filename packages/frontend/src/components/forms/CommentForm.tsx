import React from 'react';
import { useForm } from 'react-hook-form';
import { addComment } from '../../api/comments';
import Button from '../common/Button';
import { toast } from 'react-toastify';

interface CommentFormProps {
  courseId: string;
  onSuccess: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ courseId, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const onSubmit = async (data: { content: string }) => {
    try {
      await addComment(courseId, data.content);
      reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <textarea {...register('content')} className="w-full p-2 border rounded" placeholder="Comment" required />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CommentForm;