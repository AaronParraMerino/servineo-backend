import { Router } from 'express';
import * as ForumController from '../controllers/forum.controller';
import { verifyJWT } from '../controllers/userManagement/google.controller'; // 👈 importa el middleware

const router = Router();

// Lista de publicaciones del foro (pública)
router.get('/forums', ForumController.listForumsController);

// Crear publicación (requiere usuario autenticado)
router.post('/forums', verifyJWT, ForumController.createForumController);

// Detalle de una publicación + comentarios (pública)
router.get('/forums/:id', ForumController.getForumWithCommentsController);

// Agregar comentario (requiere usuario autenticado)
router.post('/forums/:id/comments', verifyJWT, ForumController.addCommentController);

// Bloquear/desbloquear (también debería ir protegido)
router.patch('/forums/:id/lock', verifyJWT, ForumController.lockForumController);

export default router;
