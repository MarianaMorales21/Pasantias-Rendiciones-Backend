import { Router } from "express";

import { authoritiesController } from "../controllers/authoritiesController.js"

export const router = Router();

router.get("/ranks", authoritiesController.getRanks);
router.get("/ranks/:cod_ran", authoritiesController.getRank);
router.post("/ranks", authoritiesController.createRank);
router.put("/ranks/:cod_ran", authoritiesController.updateRank);
router.delete("/ranks/:cod_ran", authoritiesController.deleteRank);

router.get("/authorities", authoritiesController.getAuthorities);
router.get("/authorities/:cod_aut", authoritiesController.getAuthority);
router.post("/authorities", authoritiesController.createAuthority);
router.put("/authorities/:cod_aut", authoritiesController.updateAuthority);
router.delete("/authorities/:cod_aut", authoritiesController.deleteAuthority);

export default router;