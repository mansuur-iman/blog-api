import { prisma } from "../lib/prisma.js";

export const getAllPosts = async (req, res, next) => {
  try {
    const { sort, page, limit, published } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const posts = await prisma.post.findMany({
      where: {
        published: published ? published === true : undefined,
      },
      select: {
        id: true,
        title: true,
        text: true,
        description: true,
        imageUrl: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        published: true,
        createdAt: true,
        updatedAt: true,
        comments: {
          select: {
            id: true,
            text: true,
          },
        },
      },
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next();
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        title: true,
        text: true,
        description: true,
        imageUrl: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        published: true,
        createdAt: true,
        updatedAt: true,
        comments: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        msg: "post not found.",
      });
    }

    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const data = {};
    if (req.body.title) data.title = req.body.title;
    if (req.body.text) data.text = req.body.text;
    if (req.body.description) data.description = req.body.description;
    if (req.body.imageUrl) data.imageUrl = req.body.imageUrl;
    const post = await prisma.post.update({
      where: {
        id: req.params.id,
      },
      data,
      select: {
        id: true,
        title: true,
        text: true,
        description: true,
        imageUrl: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        published: true,
        createdAt: true,
        updatedAt: true,
        comments: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        msg: "post not found.",
      });
    }

    return res.status(200).json({
      msg: "updated post successfully.",
      post,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await prisma.post.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      msg: "post deleted successfully.",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        text: req.body.text,
        description: req.body.description || "",
        imageUrl: req.body.imageUrl || "",
        authorId: req.user.userId,
        published: req.body.published ?? false,
      },
      select: {
        id: true,
        title: true,
        text: true,
        description: true,
        imageUrl: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        published: true,
        createdAt: true,
        updatedAt: true,
        comments: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });

    res.status(200).json({
      msg: "post created successfully.",
      post,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const search = async (req, res, next) => {
  try {
    const { page, sort, limit, term } = req.query;
    const searchTerm = term || "";

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const post = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { text: { contains: searchTerm, mode: "insensitive" } },
          {
            author: { username: { contains: searchTerm, mode: "insensitive" } },
          },
        ],
      },
      include: {
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
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
