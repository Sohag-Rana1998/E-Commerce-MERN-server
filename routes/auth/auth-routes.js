const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
  authMiddleWare,
} = require("../../controller/auth/auth-controler");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOutUser);
router.get("/check-auth", authMiddleWare, async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    user: user,
  });
});

module.exports = router;
