import { Router } from "express";
import { renditionController } from "../controllers/renditionController.js";

export const router = Router();

router.get("/rendition", renditionController.getRenditions);
router.get("/rendition/opg/:opg_rnd", renditionController.getRenditionsByOpg);
router.get("/rendition/:cod_rnd", renditionController.getRendition);
router.post("/rendition", renditionController.createRendition);
router.put("/rendition/:cod_rnd", renditionController.updateRendition);
router.delete("/rendition/:cod_rnd", renditionController.deleteRendition);

export default router;
