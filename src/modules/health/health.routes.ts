// backend/src/modules/health/health.routes.ts
import { Router } from 'express';
import { HealthController } from './health.controller';

const router = Router();
const healthController = new HealthController();

// GET /api/health
router.get('/', healthController.checkHealth);

export default router;