import { Router } from "express";
const router = new Router();
import organisationController from "../controllers/organisation.controller.js";

router.post('/organisation', organisationController.createOrganisation);

export default router;