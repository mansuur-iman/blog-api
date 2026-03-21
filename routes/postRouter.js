import { Router } from "express";
const postRouter = Router();

import * as postControllers from "../controllers/postController.js";
import { verifyToken, isAuthor } from "../middlewear/auth.js";

postRouter.get("/", verifyToken, postControllers.getAllPosts);
postRouter.post("/", verifyToken, isAuthor, postControllers.createPost);
postRouter.get("/:id", verifyToken, postControllers.getPost);
postRouter.put("/:id", verifyToken, isAuthor, postControllers.updatePost);
postRouter.delete("/:id", verifyToken, isAuthor, postControllers.deletePost);
postRouter.get("/search", verifyToken, postControllers.search);

export default postRouter;
