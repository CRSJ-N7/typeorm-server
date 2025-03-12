import { type Request, type Response } from 'express';
import { getTodoRepository } from '../../db/todoRepository';

export const toggleAllTodos = async (req: Request, res: Response<void | { message: string }>) => {
  try {
    const todoRepository = getTodoRepository();
    const hasCompletedTasks = await todoRepository.count({ where: { isCompleted: true } });
    if (hasCompletedTasks) {
      await todoRepository.update({}, { isCompleted: false });
    } else {
      await todoRepository.update({}, { isCompleted: true });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ message: 'Failed to toggle all todos' });
  }
};
