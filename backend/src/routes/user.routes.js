import { Router } from "express";
const router = new Router();
import userController from "../controllers/user.controller.js";

router.post('/user', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getOneUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

export default router;