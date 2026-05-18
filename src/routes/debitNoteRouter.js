import { Router } from "express";
import { debitNoteController } from "../controllers/debitNoteController.js";

const router = Router();

router.get('/debit-note', debitNoteController.getDebitNotes);
router.get('/debit-note/rendition/:cod_rnd', debitNoteController.getDebitNotesByRendition);
router.get('/debit-note/:cod_ndb', debitNoteController.getDebitNote);
router.post('/debit-note', debitNoteController.createDebitNote);
router.put('/debit-note/:cod_ndb', debitNoteController.updateDebitNote);
router.delete('/debit-note/:cod_ndb', debitNoteController.deleteDebitNote);

export default router;