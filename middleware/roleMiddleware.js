// middleware/roleMiddleware.js
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin access only" });
};

export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") next();
  else res.status(403).json({ message: "Student access only" });
};
