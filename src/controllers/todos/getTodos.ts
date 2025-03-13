import { type RequestHandler } from 'express';
import { type Todo } from '../../types';
import { getTodoRepository } from '../../db/todoRepository';

type TodoData = {
  payload: Todo[];
  meta: {
    allTodosCount: number;
    completedTodosCount: number;
    activeTodosCount: number;
    maxPages: number;
  };
};
type GetTodosQuery = {
  filter: 'all' | 'completed' | 'active';
  page: string;
  limit: string;
};

type GetTodosResponse = TodoData | { message: string };
// RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals> Почему вот именно так? Почему не reqbody, а потом resbody например?

export const getTodos: RequestHandler<unknown, GetTodosResponse, unknown, GetTodosQuery> = async (req, res) => {
  try {
    const { filter, page, limit } = req.query; // А вот здесь я понимаю почему нужна деструктуризация (из вопроса в createTodo)

    if (!filter || !page || !limit) {
      res.status(400).json({ message: 'Missing filter, page, or limit parameters' });
      return;
    }

    const todoRepository = getTodoRepository();

    let whereConditions: { isCompleted?: boolean } = {}; // Я порой не понимаю надо ли такие штуки вообще типизировать, или это излишне?

    if (filter === 'completed') {
      whereConditions = { isCompleted: true };
    }
    if (filter === 'active') {
      whereConditions = { isCompleted: false };
    }

    const allTodosCount = await todoRepository.count();

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (Number.isNaN(pageNumber)) {
      res.status(400).json({ message: 'Invalid Page Value ' });
      return;
    }
    if (Number.isNaN(limitNumber)) {
      res.status(400).json({ message: 'Invalid Page Value ' });
      return;
    }

    const startIndex = (pageNumber - 1) * limitNumber;

    const paginatedTodos = await todoRepository.find({
      where: whereConditions,
      skip: startIndex,
      take: limitNumber,
      order: { id: 'ASC' }, // Мне кажется, что это костыль, а может и нет. В общем, есть вопрос.
    });

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
