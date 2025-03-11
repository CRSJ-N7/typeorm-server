import { type Request, type Response } from 'express';
import { type TodoData } from '../../types';
import { getTodoRepository } from '../../db/todoRepository';

type GetTodosQuery = {
  filter: 'all' | 'completed' | 'active';
  page: string;
  limit: string;
};

export const getTodos = async (
  req: Request<unknown, unknown, unknown, GetTodosQuery>,
  res: Response<TodoData | { message: string }>,
) => {
  try {
    const { filter, page, limit } = req.query;

    if (!filter || !page || !limit) {
      res.status(400).json({ message: 'Missing filter, page, or limit parameters' });
      return;
    }

    const todoRepository = getTodoRepository();

    const queryBuilder = todoRepository.createQueryBuilder('todo');

    if (filter === 'completed') {
      queryBuilder.where('todo.isCompleted = :isCompleted', { isCompleted: true });
    } else if (filter === 'active') {
      queryBuilder.where('todo.isCompleted = :isCompleted', { isCompleted: false });
    }

    const allTodosCount = await queryBuilder.getCount();

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const startIndex = (pageNumber - 1) * limitNumber;

    queryBuilder.skip(startIndex).take(limitNumber);

    const paginatedTodos = await queryBuilder.getMany();

    const activeTodosCount = await todoRepository.count({ where: { isCompleted: false } });
    const completedTodosCount = allTodosCount - activeTodosCount;

    const maxPages = Math.ceil(allTodosCount / limitNumber);

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
