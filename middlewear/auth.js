import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "unathorized." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
};

export const isAuthor = async (req, res, next) => {
  if (req.user && req.user.role === "AUTHOR") {
    return next();
  }

  return res
    .status(403)
    .json({ msg: "forbidden: not authorized for this action." });
};
