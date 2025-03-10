import { type Request, type Response } from 'express';
import { type TodoData } from '../../types';
import { readTodos } from '../../db/todosData';

type GetTodosQuery = {
  filter: 'all' | 'completed' | 'active';
  page: string;
  limit: string;
};

export const getTodos = async (req: Request<unknown, unknown, unknown, GetTodosQuery>, res: Response<TodoData | { message: string}>) => {
  try {
    const { filter, page, limit } = req.query;

    if (!filter || !page || !limit) {
      res.status(400).json({ message: 'Missing filter, page, or limit parameters' });
      return;
    }
    const todos = await readTodos();

    let activeTodosCount = 0;
    const filteredTodos = todos.filter((todo) => {
      if (!todo.isCompleted) {
        activeTodosCount++;
      }

      if (filter === 'all') {
        return true;
      }

      if (filter === 'completed') {
        return todo.isCompleted;
      }

      if (filter === 'active') {
        return !todo.isCompleted;
      }

      return false;
    });

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedTodos = filteredTodos.slice(startIndex, endIndex);

    const allTodosCount = todos.length;
    const completedTodosCount = allTodosCount - activeTodosCount;
    const maxPages = Math.ceil(filteredTodos.length / limitNumber);

    res.status(200).json({
      payload: paginatedTodos,
      meta: {
        allTodosCount,
        completedTodosCount,
        activeTodosCount,
        maxPages,
      },
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
};
