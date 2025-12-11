import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

const authenticateToken = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = authHeader && authHeader.split('')[1];

  if (token == null) {
    return res.status(401).json({message: "Authorisation token required"});
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
        console.error("JWT Verification failed:", err);
        return res.status(403).json({ message: "Invalid or expired token"});
    }
    req.user = user;

    next();
  });
};
export default authenticateToken;