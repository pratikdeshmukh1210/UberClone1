import express from "express";
import passport from "passport";
import { signup, login, getMe } from "./auth.controller.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticate, getMe);

/* GOOGLE LOGIN START */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* GOOGLE CALLBACK */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login?error=google_failed" }),
  (req, res) => {
    const token = req.user.token;
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

export default router;


