import { type Request, type Response } from 'express';
import { type Todo } from '../../types';
import { readTodos, writeTodos } from '../../db/todosData';

export const createTodo = async (req: Request<unknown, unknown, { text: string }>, res: Response<Todo | { message: string }>) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    res.status(400).json({ message: 'Invalid input: text required' });
    return;
  }

  try {
    const todos = await readTodos();
    const trimmedText = req.body.text.replace(/\s+/g, ' ').trim(); // 👹
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmedText,
      isCompleted: false,
    };
    todos.push(newTodo);
    await writeTodos(todos);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Failed to create todo' });
  }
};
