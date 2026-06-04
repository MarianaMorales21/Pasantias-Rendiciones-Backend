import  { Router } from "express"
import { BeneficiaryControllers } from "../controllers/beneficiaryController.js";

export const router = Router();

router.get("/beneficiary", BeneficiaryControllers.getBeneficiarys);
router.get("/beneficiary/:cod_ben", BeneficiaryControllers.getBeneficiary);
router.post("/beneficiary", BeneficiaryControllers.createBeneficiary);
router.put("/beneficiary/:cod_ben", BeneficiaryControllers.updateBeneficiary);
router.delete("/beneficiary/:cod_ben", BeneficiaryControllers.deleteBeneficiary);

export default router;
