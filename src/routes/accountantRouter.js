import { Router } from 'express'
import { AccountantController } from '../controllers/accountantController.js'

export const router = Router();

router.get("/accountant", AccountantController.getAccountants);
router.get("/accountant/:ced_ctd", AccountantController.getAccountant);
router.post("/accountant", AccountantController.createAccountant);
router.put("/accountant/:ced_ctd", AccountantController.updateAccountant);
router.delete("/accountant/:ced_ctd", AccountantController.deleteAccountant);

export default router;