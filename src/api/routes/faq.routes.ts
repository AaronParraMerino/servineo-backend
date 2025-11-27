import { Router } from 'express';
import {
  getAllFAQsController,
  searchFAQsController,
  getFAQByIdController,
} from '../controllers/faq.controller';

const router = Router();

router.get('/faqs', getAllFAQsController);
router.get('/faqs/search', searchFAQsController);
router.get('/faqs/:id', getFAQByIdController);

export default router;
