import { Router } from 'express';
import authRoutes from './authRoute';
import todoRoutes from './todoRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

export default router;