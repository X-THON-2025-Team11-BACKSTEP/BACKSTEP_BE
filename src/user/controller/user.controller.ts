import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PurchaseProjectDto } from '../dto/purchase-project.dto';
import { User } from '@prisma/client';
import { BadRequestError, UnauthorizedError, AppError, NotFoundError } from '../../common/error/AppError';
import { SuccessResponse } from '../../common/utils/successResponse';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      const user = req.user as User;
      const updateData: UpdateUserDto = req.body;

      // Validate request body exists
      if (!updateData || typeof updateData !== 'object') {
        throw new BadRequestError('Invalid request body');
      }

      // Validate at least one field is provided
      if (updateData.nickname === undefined && updateData.profile_image === undefined && updateData.bio === undefined) {
        throw new BadRequestError('No update data provided');
      }

      // Validate nickname if provided
      if (updateData.nickname && typeof updateData.nickname !== 'string') {
        throw new BadRequestError('nickname must be a string');
      }

      // Validate nickname is not empty if provided
      if (updateData.nickname && updateData.nickname.trim().length === 0) {
        throw new BadRequestError('nickname cannot be empty');
      }

      const updatedUser = await this.userService.updateUser(user.userId, updateData);

      // Format response according to user's specification
      const responseData = {
        user: {
          user_id: updatedUser.userId,
          name: updatedUser.name,
          nickname: updatedUser.nickname,
          email: updatedUser.email,
          money: updatedUser.money,
          bio: (updatedUser as any).bio ?? null,
          profile_image: (updatedUser as any).profileImage ?? null,
          created_at: updatedUser.createdAt,
          updated_at: updatedUser.updatedAt,
        },
      };

      res.json(SuccessResponse.ok(responseData, '회원 정보 수정 완료'));
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to BadRequestError to avoid 500
      console.error('Unexpected error in updateUser:', error);
      next(new BadRequestError('Invalid request or user not found'));
    }
  };

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      // Get userId from params
      const userIdParam = req.params.userId;
      
      // Validate userId parameter exists
      if (!userIdParam || userIdParam.trim() === '') {
        throw new BadRequestError('userId parameter is required');
      }

      // Validate userId is a number
      const userId = parseInt(userIdParam, 10);
      if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
        throw new BadRequestError('Invalid userId: must be a positive integer');
      }

      // Check for very large numbers (potential overflow)
      if (userId > Number.MAX_SAFE_INTEGER) {
        throw new BadRequestError('Invalid userId: number is too large');
      }

      const user = await this.userService.getUserProfile(userId);

      // Format response according to user's specification
      const responseData = {
        user: {
          user_id: user.userId,
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          bio: (user as any).bio ?? null,
          profile_image: (user as any).profileImage ?? null,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      };

      res.json(SuccessResponse.ok(responseData, '회원 정보 조회 완료'));
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Unexpected error in getUserProfile:', error);
      next(new NotFoundError('User not found'));
    }
  };

  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      const user = req.user as User;

      // Validate user data exists
      if (!user.userId) {
        throw new BadRequestError('Invalid user data');
      }

      // Return current user info including user_id
      const responseData = {
        user: {
          user_id: user.userId,
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          money: user.money,
          bio: (user as any).bio ?? null,
          profile_image: (user as any).profileImage ?? null,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      };

      res.json(SuccessResponse.ok(responseData, '현재 유저 정보'));
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to BadRequestError to avoid 500
      console.error('Unexpected error in getCurrentUser:', error);
      next(new BadRequestError('Invalid user data'));
    }
  };

  addHelpful = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      const user = req.user as User;
      const projectIdParam = req.params.projectId;

      // Validate projectId parameter exists
      if (!projectIdParam || projectIdParam.trim() === '') {
        throw new BadRequestError('projectId parameter is required');
      }

      // Validate projectId is a number
      const projectId = parseInt(projectIdParam, 10);
      if (isNaN(projectId) || projectId <= 0 || !Number.isInteger(projectId)) {
        throw new BadRequestError('Invalid projectId: must be a positive integer');
      }

      // Check for very large numbers
      if (projectId > Number.MAX_SAFE_INTEGER) {
        throw new BadRequestError('Invalid projectId: number is too large');
      }

      const helpful = await this.userService.addHelpful(user.userId, projectId);

      // Format response according to user's specification
      const responseData = {
        user: {
          user_id: helpful.userId,
          project_id: helpful.projectId,
          userprojecthelpful_id: helpful.userProjectHelpfulId,
        },
      };

      res.json(SuccessResponse.ok(responseData, '좋아요 추가 완료'));
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Unexpected error in addHelpful:', error);
      next(new NotFoundError('User or project not found'));
    }
  };

  removeHelpful = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      const user = req.user as User;
      const projectIdParam = req.params.projectId;

      // Validate projectId parameter exists
      if (!projectIdParam || projectIdParam.trim() === '') {
        throw new BadRequestError('projectId parameter is required');
      }

      // Validate projectId is a number
      const projectId = parseInt(projectIdParam, 10);
      if (isNaN(projectId) || projectId <= 0 || !Number.isInteger(projectId)) {
        throw new BadRequestError('Invalid projectId: must be a positive integer');
      }

      // Check for very large numbers
      if (projectId > Number.MAX_SAFE_INTEGER) {
        throw new BadRequestError('Invalid projectId: number is too large');
      }

      await this.userService.removeHelpful(user.userId, projectId);

      // Format response according to user's specification
      res.json(SuccessResponse.ok({ user: {} }, '삭제되었습니다'));
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Unexpected error in removeHelpful:', error);
      next(new NotFoundError('Helpful not found'));
    }
  };

  purchaseProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      const user = req.user as User;
      const projectIdParam = req.params.projectId;
      const purchaseData: PurchaseProjectDto = req.body;

      // Validate projectId parameter exists
      if (!projectIdParam || projectIdParam.trim() === '') {
        throw new BadRequestError('projectId parameter is required');
      }

      // Validate projectId is a number
      const projectId = parseInt(projectIdParam, 10);
      if (isNaN(projectId) || projectId <= 0 || !Number.isInteger(projectId)) {
        throw new BadRequestError('Invalid projectId: must be a positive integer');
      }

      // Check for very large numbers
      if (projectId > Number.MAX_SAFE_INTEGER) {
        throw new BadRequestError('Invalid projectId: number is too large');
      }

      // Validate request body
      if (!purchaseData || typeof purchaseData !== 'object') {
        throw new BadRequestError('Invalid request body');
      }

      // Validate price is provided
      if (purchaseData.price === undefined || purchaseData.price === null) {
        throw new BadRequestError('price field is required');
      }

      // Validate price is a number
      if (typeof purchaseData.price !== 'number' || !Number.isInteger(purchaseData.price) || purchaseData.price <= 0) {
        throw new BadRequestError('Invalid price: must be a positive integer');
      }

      // Purchase project
      const result = await this.userService.purchaseProject(user.userId, projectId, purchaseData.price);

      // Format response according to user's specification
      res.status(200).json({
        success: true,
        message: '구매 이력 추가 완료',
        data: {
          user: {
            purchase_id: result.purchase.purchaseId,
            user_id: result.user.userId,
            project_id: result.purchase.projectId,
            created_date: result.purchase.createdAt,
            name: result.user.name,
            nickname: result.user.nickname,
            email: result.user.email,
            money: result.user.money,
            created_at: result.user.createdAt,
            updated_at: result.user.updatedAt,
          },
        },
        code: 200,
      });
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to BadRequestError to avoid 500
      console.error('Unexpected error in purchaseProject:', error);
      next(new BadRequestError('Purchase failed'));
    }
  };

  getHelpfulProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      // Get userId from params
      const userIdParam = req.params.userId;
      
      // Validate userId parameter exists
      if (!userIdParam || userIdParam.trim() === '') {
        throw new BadRequestError('userId parameter is required');
      }

      // Validate userId is a number
      const userId = parseInt(userIdParam, 10);
      if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
        throw new BadRequestError('Invalid userId: must be a positive integer');
      }

      // Check for very large numbers
      if (userId > Number.MAX_SAFE_INTEGER) {
        throw new BadRequestError('Invalid userId: number is too large');
      }

      // Get helpful projects
      const helpfulProjects = await this.userService.getHelpfulProjects(userId);

      // Format response according to user's specification
      const projects = helpfulProjects.map((item) => {
        const failureCategories = item.project.categories
          .map((cat) => cat.category.name)
          .filter((name): name is string => name !== null);

        return {
          name: item.project.name ?? '',
          user: item.project.user.name ?? '',
          project_id: item.project.projectId,
          project_image: item.project.image ?? '',
          period: item.project.period ?? '',
          sale_status: item.project.saleStatus ?? '',
          is_free: item.project.isFree ? 'true' : 'false',
          price: item.project.price ?? 0,
          helpful_count: item.project.helpfulCount ?? 0,
          failure_catagory: failureCategories,
        };
      });

      res.status(200).json({
        success: true,
        message: '완료',
        data: {
          data_total: projects.length,
          projects,
        },
        code: 200,
      });
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Unexpected error in getHelpfulProjects:', error);
      next(new NotFoundError('Failed to get helpful projects'));
    }
  };

  getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      // Get userId from params
      const userIdParam = req.params.userId;
      
      // Validate userId parameter exists
      if (!userIdParam || userIdParam.trim() === '') {
        throw new BadRequestError('userId parameter is required');
      }

      // Validate userId is a number
      const userId = parseInt(userIdParam, 10);
      if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
        throw new BadRequestError('Invalid userId: must be a positive integer');
      }

      // Check for very large numbers
      if (userId > Number.MAX_SAFE_INTEGER) {
        throw new BadRequestError('Invalid userId: number is too large');
      }

      // Get user projects
      const userProjects = await this.userService.getUserProjects(userId);

      // Format response according to user's specification
      const projects = userProjects.map((project) => {
        const failureCategories = project.categories
          .map((cat) => cat.category.name)
          .filter((name): name is string => name !== null);

        return {
          name: project.name ?? '',
          user: project.user.name ?? '',
          project_id: project.projectId,
          project_image: project.image ?? '',
          period: project.period ?? '',
          sale_status: project.saleStatus ?? '',
          is_free: project.isFree ? 'true' : 'false',
          price: project.price ?? 0,
          helpful_count: project.helpfulCount ?? 0,
          failure_catagory: failureCategories,
        };
      });

      res.status(200).json({
        success: true,
        message: '완료',
        data: {
          data_total: projects.length,
          projects,
        },
        code: 200,
      });
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Unexpected error in getUserPosts:', error);
      next(new NotFoundError('Failed to get user posts'));
    }
  };

  getPurchasedProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('User authentication required');
      }

      // Get userId from params
      const userIdParam = req.params.userId;
      
      // Validate userId parameter exists
      if (!userIdParam || userIdParam.trim() === '') {
        throw new BadRequestError('userId parameter is required');
      }

      // Validate userId is a number
      const userId = parseInt(userIdParam, 10);
      if (isNaN(userId) || userId <= 0 || !Number.isInteger(userId)) {
        throw new BadRequestError('Invalid userId: must be a positive integer');
      }

      // Check for very large numbers
      if (userId > Number.MAX_SAFE_INTEGER) {
        throw new BadRequestError('Invalid userId: number is too large');
      }

      // Get purchased projects
      const purchasedProjects = await this.userService.getPurchasedProjects(userId);

      // Format response according to user's specification
      const projects = purchasedProjects.map((item) => {
        const failureCategories = item.project.categories
          .map((cat) => cat.category.name)
          .filter((name): name is string => name !== null);

        return {
          name: item.project.name ?? '',
          user: item.project.user.name ?? '',
          project_id: item.project.projectId,
          project_image: item.project.image ?? '',
          period: item.project.period ?? '',
          failure_catagory: failureCategories,
        };
      });

      res.status(200).json({
        success: true,
        message: '완료',
        data: {
          data_total: projects.length,
          projects,
        },
        code: 200,
      });
    } catch (error) {
      // If it's already an AppError, pass it through
      if (error instanceof AppError) {
        return next(error);
      }
      // For unexpected errors, convert to NotFoundError to avoid 500
      console.error('Unexpected error in getPurchasedProjects:', error);
      next(new NotFoundError('Failed to get purchased projects'));
    }
  };
}

