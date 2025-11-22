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
    
    // In a real SPA, you might redirect to frontend with token in query param or cookie
    // For API test, just returning JSON
    res.json(SuccessResponse.ok({ token, user }));
  };
}

