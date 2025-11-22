import { PrismaClient, User } from '@prisma/client';

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async updateUser(userId: number, data: { nickname?: string }): Promise<User> {
    return await this.prisma.user.update({
      where: { userId },
      data: {
        ...(data.nickname !== undefined && { nickname: data.nickname }),
      },
    });
  }

  async findUserById(userId: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { userId },
    });
  }
}

