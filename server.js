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

server.use((err, req, res, nex) => {
  if (err) {
    return res.status(500).json({ msg: "Internal server error occured." });
  }
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`running server on port:${PORT}`);
});
