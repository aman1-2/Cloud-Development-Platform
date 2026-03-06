import express from 'express';

import { pingCheck } from '../../controllers/pingController.js';
import projectRouter from '../v1/projects.js';

const router = express.Router();

router.use('/ping', pingCheck);
router.use('/projects', projectRouter);

export default router;