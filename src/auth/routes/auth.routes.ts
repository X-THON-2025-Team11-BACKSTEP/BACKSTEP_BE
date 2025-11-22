import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controller/auth.controller';

const router = Router();
const authController = new AuthController();

// Google Login Route
router.get(
  '/google',
  (req, res, next) => {
    const state = req.query.state as string;
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      state: state // 프론트에서 받은 state 값을 구글에 전달
    })(req, res, next);
  }
);

// Google Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

export default router;

