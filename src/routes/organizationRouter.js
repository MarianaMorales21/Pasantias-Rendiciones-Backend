import { OrganizationControllers } from "../controllers/organizationController.js";
import { Router } from "express";

export const router = Router();

router.get("/organization", OrganizationControllers.getOrganizations);
router.get("/organization/:rif_org", OrganizationControllers.getOrganization);

export default router;