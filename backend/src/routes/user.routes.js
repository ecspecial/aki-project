import { Router } from "express";
const router = new Router();
import userController from "../controllers/user.controller.js";
import { uploadProfilePicture } from "../middlewares/photoUpload.js";

router.post('/user', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getOneUser);
router.put('/user/:id', userController.updateUser);
router.post('/user/:id/photo', uploadProfilePicture.single('profile_picture'), userController.uploadImage);
router.delete('/user/:id', userController.deleteUser);

export default router;