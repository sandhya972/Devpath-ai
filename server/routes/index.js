import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import careerRoutes from './careerRoutes.js';
import projectRoutes from './projectRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/career', careerRoutes);
router.use('/project', projectRoutes);

export default router;
