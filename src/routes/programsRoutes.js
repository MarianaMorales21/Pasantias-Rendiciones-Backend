import { Router } from "express";
import { ProgramsControllers } from "../controllers/programsController.js";

export const router = Router();

router.get("/programs", ProgramsControllers.getPrograms);
router.get("/programs/:cod_pro", ProgramsControllers.getProgram);
router.post("/programs", ProgramsControllers.createProgram);
router.put("/programs/:cod_pro", ProgramsControllers.updateProgram);
router.delete("/programs/:cod_pro", ProgramsControllers.deleteProgram);

export default router;