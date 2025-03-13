import { type RequestHandler } from 'express';
import { type DeleteResult } from 'typeorm';
import { type CommonResponse } from 'src/types';
import { getTodoRepository } from '../../db/todoRepository';

type DeleteTodoParams = {
  id: string;
};

export const deleteTodo: RequestHandler<DeleteTodoParams, CommonResponse> = async (req, res) => {
  try {
    const todoId = req.params.id;
    const todoRepository = getTodoRepository();
    const deletedResult: DeleteResult = await todoRepository.delete(todoId);

    if (deletedResult.affected === 0) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
};
