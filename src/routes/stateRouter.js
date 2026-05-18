import { Router } from 'express';
import { StateController } from '../controllers/stateController.js';

export const router = Router();

router.get('/state', StateController.getStates);
router.get('/state/:cod_sta', StateController.getState); // FIXED: missing parameter name

export default router;