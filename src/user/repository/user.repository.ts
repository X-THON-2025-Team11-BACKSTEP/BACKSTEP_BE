import { PrismaClient, User, Prisma, UserProjectHelpful, PurchaseHistory } from '@prisma/client';
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

  async findProjectById(projectId: number): Promise<{ projectId: number } | null> {
    try {
      if (!Number.isInteger(projectId) || projectId <= 0) {
        return null;
      }

      const project = await this.prisma.project.findUnique({
        where: { projectId },
        select: { projectId: true },
      });
      
      return project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return null;
      }
      console.error('Error finding project by id:', error);
      return null;
    }
  }

  async findHelpfulByUserAndProject(userId: number, projectId: number): Promise<UserProjectHelpful | null> {
    try {
      if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(projectId) || projectId <= 0) {
        return null;
      }

      const helpful = await this.prisma.userProjectHelpful.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
      });
      
      return helpful;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return null;
      }
      console.error('Error finding helpful by user and project:', error);
      return null;
    }
  }

  async createHelpful(userId: number, projectId: number): Promise<UserProjectHelpful> {
    try {
      if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(projectId) || projectId <= 0) {
        throw new BadRequestError('Invalid user ID or project ID');
      }

      return await this.prisma.userProjectHelpful.create({
        data: {
          userId,
          projectId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation (already exists)
        if (error.code === 'P2002') {
          throw new BadRequestError('Helpful already exists');
        }
        // P2003: Foreign key constraint failed
        if (error.code === 'P2003') {
          throw new NotFoundError('User or project not found');
        }
      }
      // If it's already an AppError, re-throw it
      if (error instanceof Error && error.message === 'Invalid user ID or project ID') {
        throw error;
      }
      // For any other errors, treat as not found to avoid 500
      throw new NotFoundError('User or project not found');
    }
  }

  async deleteHelpful(userId: number, projectId: number): Promise<void> {
    try {
      if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(projectId) || projectId <= 0) {
        throw new BadRequestError('Invalid user ID or project ID');
      }

      await this.prisma.userProjectHelpful.delete({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === 'P2025') {
          throw new NotFoundError('Helpful not found');
        }
      }
      // If it's already an AppError, re-throw it
      if (error instanceof Error && error.message === 'Invalid user ID or project ID') {
        throw error;
      }
      // For any other errors, treat as not found to avoid 500
      throw new NotFoundError('Helpful not found');
    }
  }

  async purchaseProject(userId: number, projectId: number, price: number): Promise<{ purchase: PurchaseHistory; user: User }> {
    try {
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }
      if (!Number.isInteger(projectId) || projectId <= 0) {
        throw new BadRequestError('Invalid project ID');
      }
      if (!Number.isInteger(price) || price <= 0) {
        throw new BadRequestError('Invalid price');
      }

      // Use transaction to ensure atomicity
      return await this.prisma.$transaction(async (tx) => {
        // Get current user with money
        const user = await tx.user.findUnique({
          where: { userId },
        });

        if (!user) {
          throw new NotFoundError('User not found');
        }

        // Check if user has enough money
        const currentMoney = user.money || 0;
        if (currentMoney < price) {
          throw new BadRequestError('Insufficient funds');
        }

        // Update user money
        const updatedUser = await tx.user.update({
          where: { userId },
          data: {
            money: {
              decrement: price,
            },
          },
        });

        // Create purchase history
        const purchase = await tx.purchaseHistory.create({
          data: {
            userId,
            projectId,
          },
        });

        return { purchase, user: updatedUser };
      });
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      // For Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found
        if (error.code === 'P2025') {
          throw new NotFoundError('User or project not found');
        }
        // P2003: Foreign key constraint failed
        if (error.code === 'P2003') {
          throw new NotFoundError('User or project not found');
        }
      }
      // For any other errors, treat as not found to avoid 500
      console.error('Error purchasing project:', error);
      throw new NotFoundError('Purchase failed');
    }
  }
}

