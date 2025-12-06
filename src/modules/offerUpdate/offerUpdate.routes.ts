import { Router } from 'express';
import { handleUpdateOffer } from './offerUpdate.controller';

const router = Router();

router.put('/:offerId', handleUpdateOffer);

export default router;
