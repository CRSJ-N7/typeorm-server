import express from 'express';
import { getTodos } from '../controllers/todos/getTodos';
import { createTodo } from '../controllers/todos/createTodo';
import { deleteTodo } from '../controllers/todos/deleteTodo';
import { updateTodo } from '../controllers/todos/updateTodo';
import { toggleAllTodos } from '../controllers/todos/toggleAllTodos';
import { removeAllCompleted } from '../controllers/todos/removeAllCompletedTodos';

const router = express.Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.patch('/', toggleAllTodos);
router.delete('/', removeAllCompleted);
router.delete('/:id', deleteTodo);
router.patch('/:id', updateTodo);

export default router;
