import { type RequestHandler } from 'express';
import { type CommonResponse } from 'src/types';
import { getTodoRepository } from '../../db/todoRepository';

export const toggleAllTodos: RequestHandler<unknown, CommonResponse> = async (req, res) => {
  try {
    const todoRepository = getTodoRepository();
    const hasCompletedTasks = await todoRepository.count({ where: { isCompleted: true } });
    const newIsCompletedStatus = !hasCompletedTasks;
    await todoRepository.update({}, { isCompleted: newIsCompletedStatus });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ message: 'Failed to toggle all todos' });
  }
};
