import { Router } from 'express';
import { generateProjectPlan } from '../controllers/projectController.js';

const router = Router();

router.post('/', generateProjectPlan);

export default router;
