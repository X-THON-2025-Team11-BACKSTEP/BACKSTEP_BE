import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../../common/utils/successResponse';
import { BadRequestError } from '../../common/error/AppError';
import { ImageService } from '../service/image.service';

export class ImageController {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename, fileType, type } = req.body;

      if (!filename || !fileType || !type) {
        throw new BadRequestError('filename, fileType, and type are required');
      }

      if (type !== 'profile' && type !== 'project') {
        throw new BadRequestError('type must be either "profile" or "project"');
      }

      const folder = type === 'profile' ? 'profiles' : 'projects';
      const result = await this.imageService.getPresignedUrl(folder, filename, fileType);

      res.json(SuccessResponse.ok(result, 'Presigned URL generated successfully'));
    } catch (error) {
      next(error);
    }
  };
}
