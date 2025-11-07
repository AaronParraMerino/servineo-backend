// backend/src/features/faq/routes/faq.routes.ts
import { Router } from 'express';
import { FAQController } from '../controllers/faq.controller';

const router = Router();
const faqController = new FAQController();

// GET /api/faqs - Obtener todos los FAQs
router.get('/', faqController.getAllFAQs);

// GET /api/faqs/search?q=keyword - Buscar FAQs
router.get('/search', faqController.searchFAQs);

// GET /api/faqs/:id - Obtener FAQ por ID
router.get('/:id', faqController.getFAQById);

export default router;