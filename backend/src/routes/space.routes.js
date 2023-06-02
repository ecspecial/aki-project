import { Router } from 'express';
const router = new Router();
import spaceController from '../controllers/space.controller.js';
import { uploadSpacePictures } from '../middlewares/photoUpload.js';

router.post('/organisation/:id/spaces', spaceController.createSpace);
router.get('/organisation/:id/space/:spaceId', spaceController.getOneOrganisationSpace);
router.get('/organisation/:id/spaces', spaceController.getAllOrganisationSpaces);
router.get('/spaces', spaceController.getAllSpaces);
router.put('/organisation/:id/space/:spaceId', spaceController.updateSpace);
router.post('/organisation/:id/space/:spaceId',uploadSpacePictures.array('space-photos', 10), spaceController.uploadSpaceImages);
router.delete('/organisation/:id/space/:spaceId', spaceController.deleteSpace);


export default router;