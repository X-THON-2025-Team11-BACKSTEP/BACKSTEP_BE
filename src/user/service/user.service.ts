import { User } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundError } from '../../common/error/AppError';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async updateUser(userId: number, updateData: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Update user
    const updatedUser = await this.userRepository.updateUser(userId, updateData);
    return updatedUser;
  }
}

