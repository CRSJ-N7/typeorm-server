import { type Request, type Response } from 'express';
import { readTodos, writeTodos } from '../../db/todosData';

export const removeAllCompleted = async (req: Request, res: Response<void | { message: string }>) => {
  try {
    const todos = await readTodos();
    const updatedTodos = todos.filter((todo) => !todo.isCompleted);
    await writeTodos(updatedTodos);
    res.status(204).send();
  } catch (error) {
    console.error('Error toggling all todos:', error);
    res.status(500).json({ message: 'Failed to toggle all todos' });
  }
};
