import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../common/error/AppError';

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      // info에 JWT 관련 에러 메시지(예: 'No auth token', 'jwt expired')가 포함됨
      return next(new UnauthorizedError(info?.message || 'Authentication failed'));
    }

    // 성공 시 req.user에 유저 정보 할당 (Prisma User 타입)
    req.user = user;
    next();
  })(req, res, next);
};

// 선택적 인증 (로그인 안 해도 통과는 시키되, 토큰 있으면 user 정보 채워줌)
export const optionalJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(); // 에러 무시하고 진행
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
