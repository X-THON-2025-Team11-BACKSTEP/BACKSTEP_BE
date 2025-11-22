import { PrismaClient, SaleStatus } from '@prisma/client';

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
}

