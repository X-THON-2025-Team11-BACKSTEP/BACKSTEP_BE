import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controller/auth.controller';

const router = Router();
const authController = new AuthController();

// Google Login Route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

export default router;

