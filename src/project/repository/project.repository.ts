import { PrismaClient, SaleStatus, Project, UserProjectHelpful, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../../common/error/AppError';

const prisma = new PrismaClient();

export class ProjectRepository {
  async createProject(data: {
    userId: number;
    name: string;
    period: string;
    personnel: number;
    intent: string;
    myRole: string;
    saleStatus: SaleStatus;
    isFree: boolean;
    price: number;
    resultUrl: string;
    growthPoint: string;
  }) {
    return await prisma.project.create({
      data: {
        userId: data.userId,
        name: data.name,
        period: data.period,
        personnel: data.personnel,
        intent: data.intent,
        myRole: data.myRole,
        saleStatus: data.saleStatus,
        isFree: data.isFree,
        price: data.price,
        resultUrl: data.resultUrl,
        growthPoint: data.growthPoint,
      },
    });
  }

  async findCategoryByName(name: string) {
    return await prisma.failureCategory.findFirst({
      where: { name },
    });
  }

  async createProjectCategoryMap(data: {
    projectId: number;
    categoryId: number;
    answer1: string;
    answer2: string;
    answer3: string;
  }) {
    return await prisma.projectCategoryMap.create({
      data: {
        projectId: data.projectId,
        categoryId: data.categoryId,
        answer1: data.answer1,
        answer2: data.answer2,
        answer3: data.answer3,
      },
    });
  }

  async findProjectById(projectId: number): Promise<Project | null> {
    try {
      // Validate projectId
      if (!Number.isInteger(projectId) || projectId <= 0) {
        return null;
      }

      return await prisma.project.findUnique({
        where: { projectId },
      });
    } catch (error) {
      // For any Prisma errors, return null to avoid 500
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
      }
      console.error('Error finding project by id:', error);
      return null;
    }
  }

  async findHelpfulByUserAndProject(userId: number, projectId: number): Promise<UserProjectHelpful | null> {
    try {
      // Validate userId and projectId
      if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(projectId) || projectId <= 0) {
        return null;
      }

      return await prisma.userProjectHelpful.findFirst({
        where: {
          userId,
          projectId,
        },
      });
    } catch (error) {
      // For any Prisma errors, return null to avoid 500
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2001: Record does not exist
        if (error.code === 'P2001') {
          return null;
        }
      }
      console.error('Error finding helpful by user and project:', error);
      return null;
    }
  }

  async createHelpful(userId: number, projectId: number): Promise<UserProjectHelpful> {
    try {
      // Validate inputs
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }

      if (!Number.isInteger(projectId) || projectId <= 0) {
        throw new BadRequestError('Invalid project ID');
      }

      return await prisma.userProjectHelpful.create({
        data: {
          userId,
          projectId,
        },
      });
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation (이미 좋아요를 눌렀을 때)
        if (error.code === 'P2002') {
          throw new BadRequestError('Already marked as helpful');
        }
        // P2003: Foreign key constraint failed
        if (error.code === 'P2003') {
          throw new NotFoundError('Project or user not found');
        }
        // P2000: Input value is too long
        if (error.code === 'P2000') {
          throw new BadRequestError('Invalid input value');
        }
      }
      // For any other errors, treat as bad request to avoid 500
      console.error('Error creating helpful:', error);
      throw new BadRequestError('Failed to create helpful mark');
    }
  }
}

