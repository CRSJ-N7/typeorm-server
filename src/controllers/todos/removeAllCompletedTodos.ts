import { type RequestHandler } from 'express';
import { type DeleteResult } from 'typeorm';
import { type CommonResponse } from 'src/types';
import { getTodoRepository } from '../../db/todoRepository';

export const removeAllCompleted: RequestHandler<unknown, CommonResponse> = async (req, res) => {
  try {
    const todoRepository = getTodoRepository();
    const deletedResult: DeleteResult = await todoRepository.delete({ isCompleted: true });

    if (deletedResult.affected === 0) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ message: 'Failed to toggle all todos' });
  }
};
