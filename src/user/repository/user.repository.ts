import { PrismaClient, User, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../../common/error/AppError';

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async updateUser(userId: number, data: { nickname: string }): Promise<User> {
    try {
      // Validate input
      if (!data.nickname || typeof data.nickname !== 'string') {
        throw new BadRequestError('Invalid nickname data');
      }

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
          throw new BadRequestError('Nickname already exists');
        }
        // P2000: Input value is too long
        if (error.code === 'P2000') {
          throw new BadRequestError('Nickname is too long');
        }
        // P2003: Foreign key constraint failed
        if (error.code === 'P2003') {
          throw new BadRequestError('Invalid user reference');
        }
      }
      // If it's already an AppError, re-throw it
      if (error instanceof Error && error.message === 'Invalid nickname data') {
        throw error;
      }
      // For any other Prisma errors, treat as not found to avoid 500
      throw new NotFoundError('User not found or update failed');
    }
  }

  async findUserById(userId: number): Promise<User | null> {
    try {
      // Validate userId is a valid number
      if (!Number.isInteger(userId) || userId <= 0) {
        return null; // Return null instead of throwing to avoid 500
      }

      const user = await this.prisma.user.findUnique({
        where: { userId },
      });
      
      return user;
    } catch (error) {
      // For any Prisma errors, just return null to avoid 500
      // This will be handled by service layer as "not found"
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2001: Record does not exist
        if (error.code === 'P2001') {
          return null;
        }
        // P2000: Input value is too long
        if (error.code === 'P2000') {
          return null;
        }
        // P2003: Foreign key constraint failed
        if (error.code === 'P2003') {
          return null;
        }
      }
      // For any other errors, return null to avoid 500
      console.error('Error finding user by id:', error);
      return null;
    }
  }
}

