import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../service/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { SuccessResponse } from '../../common/utils/successResponse';
import { BadRequestError, AppError } from '../../common/error/AppError';
import { User } from '@prisma/client';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.user는 auth.middleware에서 설정됨
      const user = req.user as User;
      if (!user) {
        throw new BadRequestError('사용자 정보를 찾을 수 없습니다.');
      }

      const userId = user.userId;
      const createProjectDto: CreateProjectDto = req.body;

      // 필수 필드 검증
      if (!createProjectDto.name || !createProjectDto.period || !createProjectDto.personnel || !createProjectDto.growth_point) {
        throw new BadRequestError('필수 필드가 누락되었습니다.');
      }

      if (createProjectDto.personnel  < 1) {
        throw new BadRequestError('인원이 한명 미만 입니다.');
      }


      if( (createProjectDto.is_free == true && createProjectDto.price != 0) || (createProjectDto.is_free == true && createProjectDto.price == 0)){
        throw new BadRequestError('공개 여부와 가격이 일치하지 않습니다.');
      }

      if( createProjectDto.price < 0){
        throw new BadRequestError('가격이 잘못된 값입니다.');
      }

      if(createProjectDto.sale_status != "NOTSALE" && createProjectDto.sale_status != "FREE" && createProjectDto.sale_status != "ONSALE"){
                throw new BadRequestError('sale_status가 잘못된 값입니다.');
      }
      
      if(createProjectDto.failure_category.length > 5 || createProjectDto.failure_category.length < 1){
                throw new BadRequestError('잘못된 카테고리 개수 입니다.');
      }

      // failure_category와 failure 검증
      if (createProjectDto.failure_category.length !== createProjectDto.failure.length) {
        throw new BadRequestError('failure_category와 failure의 개수가 일치하지 않습니다.');
      }

      // 각 카테고리별 답변 검증
      for (let i = 0; i < createProjectDto.failure_category.length; i++) {
        const categoryName = createProjectDto.failure_category[i];
        const failureItem = createProjectDto.failure[i];
        
        // 해당 카테고리가 failure 객체에 존재하는지 확인
        if (!failureItem[categoryName]) {
          throw new BadRequestError(`카테고리 "${categoryName}"에 해당하는 답변이 없습니다.`);
        }

        const answers = failureItem[categoryName];
        
        // 답변이 3개인지 확인
        if (answers.length !== 3) {
          throw new BadRequestError(`카테고리 "${categoryName}"의 답변은 3개여야 합니다.`);
        }

        // 각 답변이 비어있지 않은지 확인
        for (let j = 0; j < 3; j++) {
          if (!answers[j] || answers[j].trim() === '') {
            throw new BadRequestError(`카테고리 "${categoryName}"의 ${j + 1}번째 답변이 비어있습니다.`);
          }
        }
      }


      await this.projectService.createProject(userId, createProjectDto);

      res.status(200).json({
        message: '업로드 완료',
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  };

  addHelpful = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate user is authenticated
      if (!req.user) {
        throw new BadRequestError('User authentication required');
      }

      const user = req.user as User;

      // Get projectId from params
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

      const helpful = await this.projectService.addHelpful(user.userId, projectId);

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
      // For unexpected errors, convert to BadRequestError to avoid 500
      console.error('Unexpected error in addHelpful:', error);
      next(new BadRequestError('Failed to add helpful mark'));
    }
  };
}
  };
}

