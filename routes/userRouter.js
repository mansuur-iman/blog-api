import { Router } from "express";
const userRouter = Router();
import * as userController from "../controllers/userController.js";
import { verifyToken } from "../middlewear/auth.js";

userRouter.get("/", verifyToken, userController.getAllUsers);
userRouter.get("/:id", verifyToken, userController.getUser);
userRouter.put("/:id", verifyToken, userController.updateUser);
userRouter.delete("/:id", verifyToken, userController.deleteUser);
userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/me", verifyToken, userController.getMe);

export default userRouter;
