import fs from 'fs';
import path from 'path';
import { type Todo } from '../types';

const todosFilePath = path.normalize(`${__dirname}/todos.json`);

export const readTodos = async (): Promise<Todo[]> => {
  try {
    const data = await fs.promises.readFile(todosFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if (error.code === 'ENOENT') {
        await writeTodos([]);
        return [];
      }
    }
    throw error;
  }
};

export const writeTodos = async (todos: Todo[]): Promise<void> => {
  await fs.promises.writeFile(todosFilePath, JSON.stringify(todos, null, 2));
};
