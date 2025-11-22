import { User } from '@prisma/client';
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
      // Check if user exists
      const existingUser = await this.userRepository.findUserById(userId);
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      // Validate nickname length if needed
      if (updateData.nickname && updateData.nickname.length > 255) {
        throw new BadRequestError('Nickname is too long (max 255 characters)');
      }

      // Update user
      const updatedUser = await this.userRepository.updateUser(userId, updateData);
      return updatedUser;
    } catch (error) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      // For unexpected errors, wrap in InternalServerError
      console.error('Error updating user:', error);
      throw new InternalServerError('Failed to update user information');
    }
  }
}

