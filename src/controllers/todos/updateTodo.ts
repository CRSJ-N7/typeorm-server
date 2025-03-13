import { type RequestHandler } from 'express';
import { type idParams } from 'src/types';
import { type Todo } from '../../types';
import { getTodoRepository } from '../../db/todoRepository';
// Почему если я тут ставлю Partial<Todo>, то не работает?
type UpdateTodoReqBody = {
  title?: string;
  isCompleted?: boolean;
};

type UpdateTodoResponse = Todo | { message: string };

export const updateTodo: RequestHandler<idParams, UpdateTodoResponse, UpdateTodoReqBody> = async (req, res) => {
  try {
    const todoRepository = getTodoRepository();
    const todoId = parseInt(req.params.id, 10);

    if (Number.isNaN(todoId)) {
      res.status(400).json({ message: 'Invalid todo ID' });
      return;
    }
    const todo = await todoRepository.findOne({ where: { id: todoId } });
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    const text = req.body.title;
    // Если здесь указать Boolean(req.body.isCompleted), то дальнейших ошибок не будет, но почему?
    // console.info(typeof todoIsCompleted); - это чтобы я не забыл что у тебя спросить
    const todoIsCompleted = req.body.isCompleted;
    if (text !== undefined && typeof text === 'string' && text.trim()) {
      // Схожая проблема. Нельзя req.body.isCompleted.trim(), но вот если я засовываю в переменную, то можно. Почему?
      const trimmedText = text.replace(/\s+/g, ' ').trim();
      todo.title = trimmedText;
    }
    if (req.body.isCompleted !== undefined && typeof req.body.isCompleted === 'boolean') {
      // Вот тут я сам с себя прихуел. Сработало, но точно такой же вопрос как и выше.
      todo.isCompleted = !!todoIsCompleted;
    }

    await todoRepository.save(todo);
    await todoRepository.find({ order: { id: 'ASC' } });

    res.status(200).json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
};
