import { Router } from "express";
const router = new Router();
import userController from "../controllers/user.controller.js";
import { uploadProfilePicture } from "../middlewares/photoUpload.js";
import jwtAuthMiddleware from "../middlewares/jwtAuthMiddleware.js";

router.post('/user', userController.createUser);
router.post('/user/login', userController.login);
router.get('/users', jwtAuthMiddleware, userController.getUsers);
router.get('/user/:id', jwtAuthMiddleware, userController.getOneUser);
router.put('/user/:id', jwtAuthMiddleware, userController.updateUser);
router.post('/user/:id/photo', jwtAuthMiddleware, uploadProfilePicture.single('profile_picture'), userController.uploadImage);
router.delete('/user/:id', jwtAuthMiddleware, userController.deleteUser);

export default router;