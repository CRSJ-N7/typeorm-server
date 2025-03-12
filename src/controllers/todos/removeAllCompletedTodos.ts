import { type Request, type Response } from 'express';
import { type DeleteResult } from 'typeorm';
import { getTodoRepository } from '../../db/todoRepository';

export const removeAllCompleted = async (req: Request, res: Response<void | { message: string }>) => {
  try {
    const todoRepository = getTodoRepository();
    const deletedResult: DeleteResult = await todoRepository.delete({ isCompleted: true });

    if (deletedResult.affected === 0) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ message: 'Failed to toggle all todos' });
  }
};
