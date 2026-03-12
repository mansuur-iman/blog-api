import { prisma } from "../lib/prisma.js";

export const getAllComments = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
    });

    if (!post) {
      return res.status(404).json({ msg: "post not found." });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: req.params.postId,
      },

      include: {
        post: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.postId,
      },
    });

    if (!post) {
      return res.status(404).json({ msg: "post not found." });
    }

    if (!post.published) {
      return res.status(403).json({ msg: "post not published." });
    }

    const comment = await prisma.comment.create({
      data: {
        text: req.body.text,
        postId: req.params.postId,
        authorId: req.user.userId,
      },
    });

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = await prisma.comment.update({
      where: {
        id: req.params.id,
      },
      data: {
        text: req.body.text,
      },
    });

    return res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await prisma.comment.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      msg: "comment deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
