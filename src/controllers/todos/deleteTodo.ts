import { type Request, type Response } from 'express';
import { readTodos, writeTodos } from '../../db/todosData';

export const deleteTodo = async (req: Request<{id: string}>, res: Response<void | { message: string }>) => {
  try {
    const todos = await readTodos();
    const todoId = req.params.id;
    const index = todos.findIndex((todo) => todo.id === todoId);
    if (index === -1) {
      res.status(404).json({ message: 'Todo not found' });
    }
    todos.splice(index, 1);
    await writeTodos(todos);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
};
