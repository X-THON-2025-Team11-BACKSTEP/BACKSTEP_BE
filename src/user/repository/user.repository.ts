import { PrismaClient, User, Prisma } from '@prisma/client';
import { NotFoundError, InternalServerError } from '../../common/error/AppError';

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async updateUser(userId: number, data: { nickname: string }): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { userId },
        data: {
          nickname: data.nickname,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === 'P2025') {
          throw new NotFoundError('User not found');
        }
        // P2002: Unique constraint violation
        if (error.code === 'P2002') {
          throw new InternalServerError('Database constraint violation');
        }
      }
      // Re-throw as InternalServerError for unknown Prisma errors
      throw new InternalServerError('Failed to update user');
    }
  }

  async findUserById(userId: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { userId },
      });
    } catch (error) {
      // Log error but don't throw - return null instead
      console.error('Error finding user by id:', error);
      throw new InternalServerError('Failed to find user');
    }
  }
}

