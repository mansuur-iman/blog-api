import { Router } from "express";
const commentRouter = Router();

import { verifyToken } from "../middlewear/auth.js";
import * as commentControllers from "../controllers/commentController.js";

commentRouter.get(
  "/posts/:postId/comments",
  verifyToken,
  commentControllers.getAllComments,
);
commentRouter.post(
  "/posts/:postId/comments",
  verifyToken,
  commentControllers.createComment,
);
commentRouter.put(
  "/comments/:id",
  verifyToken,
  commentControllers.updateComment,
);
commentRouter.delete(
  "/comments/:id",
  verifyToken,
  commentControllers.deleteComment,
);

export default commentRouter;
