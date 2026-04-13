import  { Router } from "express"
import { BeneficiaryControllers } from "../controllers/beneficiaryController.js";

export const router = Router();

router.get("/beneficiary", BeneficiaryControllers.getBeneficiarys);
router.get("/beneficiary/:rif_ben", BeneficiaryControllers.getBeneficiary);
router.post("/beneficiary", BeneficiaryControllers.createBeneficiary);
router.put("/beneficiary/:rif_ben", BeneficiaryControllers.updateBeneficiary);
router.delete("/beneficiary/:rif_ben", BeneficiaryControllers.deleteBeneficiary);

export default router;

