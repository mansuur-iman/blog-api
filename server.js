import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentRouter.js";
import cors from "cors";

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/v1/users", userRouter);
server.use("/api/v1/posts", postRouter);
server.use("/api/v1", commentRouter);

server.use((err, req, res, next) => {
  console.error("--- SERVER ERROR ---");
  console.error(err.stack);
  console.error("--------------------");

  res.status(err.status || 500).json({
    msg: err.message || "Internal server error occurred.",
    error: err,
  });
});
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`running server on port:${PORT}`);
});
