import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@prisma/client';
import { BadRequestError, UnauthorizedError, AppError, NotFoundError } from '../../common/error/AppError';

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

      // Validate nickname is provided
      if (!updateData.nickname || typeof updateData.nickname !== 'string') {
        throw new BadRequestError('nickname field is required');
      }

      // Validate nickname is not empty
      if (updateData.nickname.trim().length === 0) {
        throw new BadRequestError('nickname cannot be empty');
      }

      const updatedUser = await this.userService.updateUser(user.userId, updateData);

      // Format response according to user's specification
      res.status(200).json({
        message: '회원 정보 수정 완료',
        user: {
          user_id: updatedUser.userId,
          name: updatedUser.name,
          nickname: updatedUser.nickname,
          email: updatedUser.email,
          money: updatedUser.money,
          created_at: updatedUser.createdAt,
          updated_at: updatedUser.updatedAt,
        },
        statusCode: 200,
      });
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
      res.status(200).json({
        message: '회원 정보 조회 완료',
        user: {
          user_id: user.userId,
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
        statusCode: 200,
      });
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
      res.status(200).json({
        message: '현재 유저 정보',
        user: {
          user_id: user.userId,
          name: user.name,
          nickname: user.nickname,
          email: user.email,
          money: user.money,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
        statusCode: 200,
      });
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
      res.status(200).json({
        message: '좋아요 추가 완료',
        user: {
          user_id: helpful.userId,
          project_id: helpful.projectId,
          userprojecthelpful_id: helpful.userProjectHelpfulId,
        },
        statusCode: 200,
      });
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
      res.status(200).json({
        message: '삭제되었습니다',
        statusCode: 200,
      });
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
}

