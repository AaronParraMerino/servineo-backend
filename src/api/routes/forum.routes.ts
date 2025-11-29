import { Router } from 'express';
import * as ForumController from '../controllers/forum.controller';

const router = Router();

// Lista de publicaciones del foro
router.get('/forums', ForumController.listForumsController);

// Crear publicación (requiere usuario autenticado)
router.post('/forums', ForumController.createForumController);

// Detalle de una publicación + comentarios
router.get('/forums/:id', ForumController.getForumWithCommentsController);

// Agregar comentario a una publicación (requiere usuario autenticado)
router.post('/forums/:id/comments', ForumController.addCommentController);

// Moderación básica: bloquear/desbloquear
router.patch('/forums/:id/lock', ForumController.lockForumController);

export default router;
