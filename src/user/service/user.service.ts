import { User, UserProjectHelpful, PurchaseHistory } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundError, InternalServerError, AppError, BadRequestError } from '../../common/error/AppError';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async updateUser(userId: number, updateData: UpdateUserDto): Promise<User> {
    try {
      // Validate userId
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }

      // Check if user exists
      const existingUser = await this.userRepository.findUserById(userId);
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      // Validate nickname length
      if (updateData.nickname && updateData.nickname.length > 255) {
        throw new BadRequestError('Nickname is too long (max 255 characters)');
      }

      // Update user
      const updatePayload: { nickname?: string, profileImage?: string } = {};
      if (updateData.nickname) updatePayload.nickname = updateData.nickname;
      if (updateData.profile_image) updatePayload.profileImage = updateData.profile_image;

      const updatedUser = await this.userRepository.updateUser(userId, updatePayload);
      return updatedUser;
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Error updating user:', error);
      throw new NotFoundError('User not found or update failed');
    }
  }

  async getUserProfile(userId: number): Promise<User> {
    try {
      // Validate userId
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }

      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return user;
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Error getting user profile:', error);
      throw new NotFoundError('User not found');
    }
  }

  async addHelpful(userId: number, projectId: number): Promise<UserProjectHelpful> {
    try {
      // Validate userId and projectId
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }
      if (!Number.isInteger(projectId) || projectId <= 0) {
        throw new BadRequestError('Invalid project ID');
      }

      // Check if user exists
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if project exists
      const project = await this.userRepository.findProjectById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check if helpful already exists
      const existingHelpful = await this.userRepository.findHelpfulByUserAndProject(userId, projectId);
      if (existingHelpful) {
        throw new BadRequestError('Helpful already exists');
      }

      // Create helpful
      const helpful = await this.userRepository.createHelpful(userId, projectId);
      return helpful;
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Error adding helpful:', error);
      throw new NotFoundError('User or project not found');
    }
  }

  async removeHelpful(userId: number, projectId: number): Promise<void> {
    try {
      // Validate userId and projectId
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }
      if (!Number.isInteger(projectId) || projectId <= 0) {
        throw new BadRequestError('Invalid project ID');
      }

      // Check if helpful exists
      const existingHelpful = await this.userRepository.findHelpfulByUserAndProject(userId, projectId);
      if (!existingHelpful) {
        throw new NotFoundError('Helpful not found');
      }

      // Delete helpful
      await this.userRepository.deleteHelpful(userId, projectId);
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Error removing helpful:', error);
      throw new NotFoundError('Helpful not found');
    }
  }

  async purchaseProject(userId: number, projectId: number, price: number): Promise<{ purchase: PurchaseHistory; user: User }> {
    try {
      // Validate userId and projectId
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }
      if (!Number.isInteger(projectId) || projectId <= 0) {
        throw new BadRequestError('Invalid project ID');
      }
      if (!Number.isInteger(price) || price <= 0) {
        throw new BadRequestError('Invalid price');
      }

      // Check if user exists
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if project exists
      const project = await this.userRepository.findProjectById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check if user has enough money
      const currentMoney = user.money || 0;
      if (currentMoney < price) {
        throw new BadRequestError('Insufficient funds');
      }

      // Check if user already purchased this project
      const existingPurchase = await this.userRepository.findPurchaseByUserAndProject(userId, projectId);
      if (existingPurchase) {
        throw new BadRequestError('Project already purchased');
      }

      // Purchase project (transaction: update money and create purchase history)
      const result = await this.userRepository.purchaseProject(userId, projectId, price);
      return result;
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      // For unexpected errors, convert to BadRequestError to avoid 500
      console.error('Error purchasing project:', error);
      throw new BadRequestError('Purchase failed');
    }
  }

  async getHelpfulProjects(userId: number): Promise<Array<{
    userProjectHelpfulId: number;
    project: {
      projectId: number;
      name: string | null;
      period: string | null;
      saleStatus: string | null;
      isFree: boolean | null;
      price: number | null;
      user: {
        name: string | null;
      };
      categories: Array<{
        category: {
          name: string | null;
        };
      }>;
    };
  }>> {
    try {
      // Validate userId
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }

      // Check if user exists
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Get helpful projects
      const helpfulProjects = await this.userRepository.findHelpfulProjectsByUserId(userId);
      return helpfulProjects;
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Error getting helpful projects:', error);
      throw new NotFoundError('Failed to get helpful projects');
    }
  }
}

