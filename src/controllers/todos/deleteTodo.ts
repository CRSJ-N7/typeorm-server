import { type Request, type Response } from 'express';
import { type DeleteResult } from 'typeorm';
import { getTodoRepository } from '../../db/todoRepository';

export const deleteTodo = async (req: Request<{id: number}>, res: Response<void | { message: string }>) => {
  try {
    const todoId = req.params.id;
    const todoRepository = getTodoRepository();
    const deletedResult: DeleteResult = await todoRepository.delete(todoId);

    if (deletedResult.affected === 0) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    console.info(deletedResult);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
};
