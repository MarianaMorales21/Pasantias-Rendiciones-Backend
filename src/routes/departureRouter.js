import { DepartureControllers } from "../controllers/departureController.js";
import { Router } from 'express';

export const router = Router();

router.get('/departure', DepartureControllers.getDepartures);
router.get('/departure/:cod_par', DepartureControllers.getDeparture);
router.post('/departure', DepartureControllers.createDeparture);
router.put('/departure/:cod_par', DepartureControllers.updateDeparture);
router.delete('/departure/:cod_par', DepartureControllers.deleteDeparture);

export default router;