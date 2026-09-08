import express from "express";
import passport from "passport";
import { signup, login, getMe } from "./auth.controller.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
import { env } from "../../config/env.js";

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
  (req, res, next) => {
    const frontendUrl = (env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${frontendUrl}/login?error=google_failed`
    })(req, res, next);
  },
  (req, res) => {
    const token = req.user.token;
    const frontendUrl = (env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

export default router;


