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
  (req, res, next) => {
    console.log("=== OAUTH RUNTIME DEBUG INFO ===");
    console.log("Runtime GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    console.log("Runtime GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
    console.log("================================");
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  }
);

/* GOOGLE CALLBACK */
router.get(
  "/google/callback",
  (req, res, next) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${frontendUrl}/login?error=google_failed`
    })(req, res, next);
  },
  (req, res) => {
    const token = req.user.token;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

export default router;


