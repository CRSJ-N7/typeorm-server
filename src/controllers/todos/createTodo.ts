import { type Request, type Response } from 'express';
import { type Todo } from '../../types';
import { getTodoRepository } from '../../db/todoRepository';

export const createTodo = async (req: Request<unknown, unknown, { title: string }>, res: Response<Todo | { message: string }>) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ message: 'Invalid input: text required' });
    return;
  }

  try {
    const trimmedText = req.body.title.replace(/\s+/g, ' ').trim(); // 👹
    const todoRepository = getTodoRepository();
    const newTodo: Todo = todoRepository.create({
      title: trimmedText,
      isCompleted: false,
    });
    await todoRepository.save(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Failed to create todo' });
  }
};
