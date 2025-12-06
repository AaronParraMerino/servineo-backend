import express from 'express';
import { postDescriptionFixer, updateWorkLocation } from '../controllers/user.controller';

const router = express.Router();

// POST /api/user/:id/description - Actualizar descripción de un fixer
router.post('/:id/description', postDescriptionFixer);

// PATCH /api/user/:id/location - Actualizar ubicación de trabajo de un fixer
router.patch('/:id/location', updateWorkLocation);

export default router;
