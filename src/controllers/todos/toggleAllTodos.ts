import { type Request, type Response } from 'express';
import { readTodos, writeTodos } from '../../db/todosData';

export const toggleAllTodos = async (req: Request, res: Response<void | { message: string }>) => {
  try {
    const todos = await readTodos();
    const hasCompletedTasks = todos.some((todo) => todo.isCompleted);
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      isCompleted: !hasCompletedTasks,
    }));
    await writeTodos(updatedTodos);
    res.status(204).send();
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ message: 'Failed to toggle all todos' });
  }
};
