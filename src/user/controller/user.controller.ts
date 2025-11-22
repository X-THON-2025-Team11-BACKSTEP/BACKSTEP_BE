import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@prisma/client';
import { BadRequestError } from '../../common/error/AppError';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new BadRequestError('User authentication required');
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
      next(error);
    }
  };
}

