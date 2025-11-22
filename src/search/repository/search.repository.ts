import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SearchRepository {

  async searchProjects(keyword?: string, failureCategories?: string[]) {
    // keyword가 ";ALL;"이거나 없으면 전체 검색
    const shouldSearchAll = !keyword || keyword === ";ALL;";
    
    // 검색 조건 구성
    const whereConditions: any[] = [];
    
    // 키워드 검색 조건
    if (!shouldSearchAll) {
      whereConditions.push({
        name: {
          contains: keyword,
        },
      });
    }
    
    // failure_category 필터링 - 모든 카테고리를 포함해야 함 (AND 조건)
    if (failureCategories && failureCategories.length > 0) {
      // 각 카테고리별로 필터링 조건 생성
      failureCategories.forEach(categoryName => {
        whereConditions.push({
          categories: {
            some: {
              category: {
                name: categoryName,
              },
            },
          },
        });
      });
    }

    const where: any = whereConditions.length > 0 ? { AND: whereConditions } : {};

    return await prisma.project.findMany({
      where,
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

  async searchUsers(keyword?: string, failureCategories?: string[]) {
    // keyword가 ";ALL;"이거나 없으면 전체 검색
    const shouldSearchAll = !keyword || keyword === ";ALL;";
  
    // 검색 조건 구성
    const where: any = {};
    
    // 키워드 검색 조건
    if (!shouldSearchAll) {
      // 일반 키워드 검색: 이름이나 닉네임에서 검색
      where.OR = [
        { name: { contains: keyword } },
        { nickname: { contains: keyword } },
      ];
    }

    return await prisma.user.findMany({
      where,
    });
  }

}
