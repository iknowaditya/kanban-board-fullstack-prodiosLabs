const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
