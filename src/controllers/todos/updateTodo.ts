import { type Request, type Response } from 'express';
import { type Todo } from '../../types';
import { readTodos, writeTodos } from '../../db/todosData';

export const updateTodo = async (req: Request<{ id: string }, unknown, Partial<Todo>>, res: Response<Todo | { message: string }>) => {
  try {
    const todos = await readTodos();
    const todoId = req.params.id;
    const index = todos.findIndex((todo) => todo.id === todoId);

    if (index === -1) {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      if (req.body.text !== undefined) {
        const trimmedText = req.body.text.replace(/\s+/g, ' ').trim(); // 👹
        if (!trimmedText) {
          res.status(400).json({ message: 'Text cannot be empty' });
          return;
        }
        todos[index].text = trimmedText;
      }
      if (req.body.isCompleted !== undefined) {
        todos[index].isCompleted = req.body.isCompleted;
      }
    }

    await writeTodos(todos);
    res.status(200).json(todos[index]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
};
