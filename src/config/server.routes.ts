import { Router, Request, Response } from 'express';
import healthRoutes from '../modules/health/health.routes';
import faqRoutes from '../features/faq/routes/faq.routes';

const router = Router();

// Rutas principales
router.use('/api/health', healthRoutes);
router.use('/api/faqs', faqRoutes);

// Ruta 404 (catch-all) — Express 5 compatible
router.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

export default router;
