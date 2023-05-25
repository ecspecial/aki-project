import { Router } from "express";
const router = new Router();
import organisationController from "../controllers/organisation.controller.js";

router.post('/organisation', organisationController.createOrganisation);
router.get('/organisation/:id', organisationController.getOneOrganisation);
router.get('/organisations', organisationController.getAllOrganisations);
router.put('/organisation/:id', organisationController.updateOrganisation);
router.delete('/organisation/:id', organisationController.deleteOrganisation);


export default router;