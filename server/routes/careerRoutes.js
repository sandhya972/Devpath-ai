import { Router } from 'express';
import { generateCareerPlan } from '../controllers/careerController.js';

const router = Router();

router.post('/', generateCareerPlan);

export default router;
