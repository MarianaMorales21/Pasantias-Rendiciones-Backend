import { OrganizationControllers } from "../controllers/organizationController.js";
import { Router } from "express";

export const router = Router();

router.get("/organization", OrganizationControllers.getOrganizations);
router.get("/organization/:rif_org", OrganizationControllers.getOrganization);
router.post("/organization", OrganizationControllers.createOrganization);
router.put("/organization/:rif_org", OrganizationControllers.updateOrganization);
router.delete("/organization/:rif_org", OrganizationControllers.deleteOrganization);

export default router;