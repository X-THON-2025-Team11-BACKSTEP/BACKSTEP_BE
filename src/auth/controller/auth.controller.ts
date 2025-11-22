import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/auth.service';
import { SuccessResponse } from '../../common/utils/successResponse';
import { User } from '@prisma/client';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  googleCallback = (req: Request, res: Response, next: NextFunction) => {
    // Passport attaches the user to req.user
    const user = req.user as User;
    const token = this.authService.generateToken(user);

    const redirectUrl = process.env.GOOGLE_LOGIN_REDIRECT_URL;

    if (redirectUrl) {
      return res.redirect(`${redirectUrl}?token=${token}`);
    }
    
    // If no redirect URL is configured, return JSON (for testing)
    res.json(SuccessResponse.ok({ token, user }));
  };
}

