import { Request, Response, NextFunction } from 'express';
import { UserService } from '../service/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@prisma/client';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      const updateData: UpdateUserDto = req.body;

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

