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
router.patch('/toggle-all', toggleAllTodos);
router.delete('/remove-all-completed', removeAllCompleted);
router.patch('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
