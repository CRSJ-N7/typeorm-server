import { type Request, type Response } from 'express';
import { type Todo } from '../../types';
import { getTodoRepository } from '../../db/todoRepository';

export const updateTodo = async (req: Request<{ id: number }, unknown, Partial<Todo>>, res: Response<Todo | { message: string }>) => {
  try {
    const todoRepository = getTodoRepository();
    const todoId = req.params.id;
    const todo = await todoRepository.findOne({ where: { id: todoId } });
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    const text = req.body.title;
    const todoIsCompleted = req.body.isCompleted;
    // console.info(typeof todoIsCompleted);
    if (text !== undefined && typeof text === 'string' && text.trim()) {
      const trimmedText = text.replace(/\s+/g, ' ').trim(); // ТС даже на комментарии ругается! Надеюсь вспомню, что тут хотел сказать.
      todo.title = trimmedText;
      await todoRepository.save(todo);
    }
    if (req.body.isCompleted !== undefined && typeof req.body.isCompleted === 'boolean') {
      todo.isCompleted = !!todoIsCompleted; // вот тут я сам с себя прихуел, ты видал ваще такое???
      await todoRepository.save(todo);
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
};
