import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateUserOnSignup = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("FirstName is required.")
    .isAlpha()
    .withMessage("FirstName Must contain only letters.")
    .isLength({ max: 50 })
    .withMessage("Maximum character is 50."),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("LastName is required.")
    .isAlpha()
    .withMessage("LastName Must contain only letters.")
    .isLength({ max: 50 })
    .withMessage("Maximum character is 50."),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ max: 50 })
    .withMessage("Maximum character is 50."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid Email.")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password Must be between 8 and 20 characters long."),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("password do not match.");
    }
    return true;
  }),
];

const validateUserOnLogin = [
  body("email").trim().notEmpty().withMessage("Email is required."),
  body("password").trim().notEmpty().withMessage("Password is required."),
];

export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, sort, role } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const users = await prisma.user.findMany({
      where: {
        role: role === "author" ? "AUTHOR" : "READER",
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        posts: true,
        comments: true,
      },
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        posts: true,
        comments: true,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "internal server error occured." });
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "user not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.deleteMany({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "user deleted." });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createUser = [
  ...validateUserOnSignup,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { first_name, last_name, username, email, password, role } =
        req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          first_name,
          last_name,
          username,
          email,
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      res.status(201).json({
        msg: "registered user successfully.",
        user,
      });
    } catch (err) {
      console.error(err);
      if (err.code === "P2002") {
        return res.status(400).json({
          msg: "username or email already exists",
        });
      }
      next(err);
    }
  },
];

export const loginUser = [
  ...validateUserOnLogin,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(401).json({ msg: "Incorrect email or password." });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return (
          res.status(401),
          json({
            msg: "Incorrect email or password.",
          })
        );
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "4h" },
      );
      res.json({
        msg: "Login successfully.",
        token: token,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];
