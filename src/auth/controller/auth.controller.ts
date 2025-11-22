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

    // state 파라미터 확인 (구글이 다시 돌려줌)
    const state = req.query.state as string;
    let redirectUrl = process.env.GOOGLE_LOGIN_REDIRECT_URL;

    // 로컬 테스트 요청인 경우 (state='local')
    if (state === 'local') {
      redirectUrl = 'http://localhost:3001/login/callback'; // 로컬 프론트 주소
    }

    if (redirectUrl) {
      return res.redirect(`${redirectUrl}?token=${token}`);
    }
    
    // If no redirect URL is configured, return JSON (for testing)
    res.json(SuccessResponse.ok({ token, user }));
  };
}

