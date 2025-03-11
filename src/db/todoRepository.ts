import { AppDataSource } from './dataSource';
import Todo from './entities/Todo';

export const getTodoRepository = () => {
  return AppDataSource.getRepository(Todo);
};
