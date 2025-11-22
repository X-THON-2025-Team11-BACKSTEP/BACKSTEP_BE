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
    image?: string;
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
        image: data.image,
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

  async findById(projectId: number, currentUserId?: number) {
    const project = await prisma.project.findUnique({
      where: { projectId },
      include: {
        user: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!project) return null;

    let isHelpful = false;
    let isPurchased = false;
    if (currentUserId) {
      const helpful = await prisma.userProjectHelpful.findUnique({
        where: {
          userId_projectId: {
            userId: currentUserId,
            projectId,
          },
        },
      });
      isHelpful = !!helpful;

      const purchase = await prisma.purchaseHistory.findFirst({
        where: {
          userId: currentUserId,
          projectId,
        },
      });
      isPurchased = !!purchase;
    }

    return {
      ...project,
      isHelpful,
      isPurchased,
    };
  }

  async updateProject(projectId: number, data: {
    name?: string;
    period?: string;
    personnel?: number;
    intent?: string;
    myRole?: string;
    saleStatus?: SaleStatus;
    isFree?: boolean;
    price?: number;
    resultUrl?: string;
    growthPoint?: string;
    image?: string;
  }) {
    return await prisma.project.update({
      where: { projectId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.period !== undefined && { period: data.period }),
        ...(data.personnel !== undefined && { personnel: data.personnel }),
        ...(data.intent !== undefined && { intent: data.intent }),
        ...(data.myRole !== undefined && { myRole: data.myRole }),
        ...(data.saleStatus !== undefined && { saleStatus: data.saleStatus }),
        ...(data.isFree !== undefined && { isFree: data.isFree }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.resultUrl !== undefined && { resultUrl: data.resultUrl }),
        ...(data.growthPoint !== undefined && { growthPoint: data.growthPoint }),
        ...(data.image !== undefined && { image: data.image }),
      },
      include: {
        user: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async deleteProjectCategoryMaps(projectId: number) {
    return await prisma.projectCategoryMap.deleteMany({
      where: { projectId },
    });
  }

  async deleteProject(projectId: number) {
    // 관련 데이터 먼저 삭제
    await prisma.userProjectHelpful.deleteMany({
      where: { projectId },
    });
    
    await prisma.purchaseHistory.deleteMany({
      where: { projectId },
    });
    
    await prisma.projectCategoryMap.deleteMany({
      where: { projectId },
    });

    // 프로젝트 삭제
    return await prisma.project.delete({
      where: { projectId },
    });
  }

  async findPopularProjects(limit: number = 7) {
    return await prisma.project.findMany({
      take: limit,
      orderBy: {
        helpfulCount: 'desc',
      },
      include: {
        user: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}

