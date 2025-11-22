import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

export class AuthService {
  generateToken(user: User): string {
    const payload = {
      id: user.userId,
      email: user.email,
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });
  }
}

