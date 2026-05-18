import { Router } from "express";
import { debitNoteDetailsController } from "../controllers/debitNoteDetailsController.js";

export const router = Router();

router.get("/rendition-detail/note/:cab_drn", debitNoteDetailsController.getDetailsByDebitNote);
router.post("/rendition-detail", debitNoteDetailsController.createDebitNoteDetail);
router.put("/rendition-detail/:cod_drn", debitNoteDetailsController.updateDebitNoteDetail);
router.delete("/rendition-detail/:cod_drn", debitNoteDetailsController.deleteDebitNoteDetail);

export default router;