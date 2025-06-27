import { Router } from 'express';
import {
    getTodos,
    getTodosPending,
    getTodosCompleted,
    createTodo,
    updateTodo,
    deleteTodo
} from '../controllers/todoController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getTodos);          
router.get('/pending', getTodosPending);
router.get('/completed', getTodosCompleted);
router.post('/', createTodo);  
router.put('/:id', updateTodo);  
router.delete('/:id', deleteTodo);

export default router;