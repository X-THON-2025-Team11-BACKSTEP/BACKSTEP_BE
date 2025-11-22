import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../service/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { SuccessResponse } from '../../common/utils/successResponse';
import { BadRequestError } from '../../common/error/AppError';
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
      //console.log(user)
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


      const project = await this.projectService.createProject(userId, createProjectDto);


      res.status(200).json({
        success: true,
        code: 200,
        message: '글 작성 완료 및 업로드 완료',
        data: {
          name : createProjectDto.name,
          name_id: project.projectId,
          project_image: project.image,
          user: user.name,
          user_id: user.userId,
          nickname: user.nickname,
          profile_image: user.profileImage,
          period : createProjectDto.period,
          personal: createProjectDto.personnel,
          intent: createProjectDto.intent,
          my_role: createProjectDto.my_role,
          sale_stauts: createProjectDto.sale_status,
          if_free: createProjectDto.is_free,
          price: createProjectDto.price,
          result_url: createProjectDto.result_url,
          failure_category: createProjectDto.failure_category,
          failure: createProjectDto.failure,
          growth_point: createProjectDto.growth_point,
          image: createProjectDto.image,
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = parseInt(req.params.projectId);

      if (isNaN(projectId)) {
        throw new BadRequestError('잘못된 프로젝트 ID입니다.');
      }

      const project = await this.projectService.getProject(projectId);

      if (!project) {
        throw new BadRequestError('프로젝트를 찾을 수 없습니다.');
      }

      // 응답 형식 변환
      const failureCategory = project.categories.map(cat => cat.category.name).filter(Boolean);
      const failure = project.categories.map(cat => ({
        [cat.category.name!]: [cat.answer1, cat.answer2, cat.answer3]
      }));

      res.status(200).json({
        success: true,
        code: 200,
        message: '글 디테일 불러오기 완료',
        data: {
          name: project.name,
          name_id: project.projectId,
          project_image: project.image,
          user: project.user.name,
          user_id: project.user.userId,
          nickname: project.user.nickname,
          profile_image: project.user.profileImage,
          period: project.period,
          personnel: project.personnel,
          intent: project.intent,
          my_role: project.myRole,
          sale_status: project.saleStatus,
          is_free: project.isFree ? "true" : "false",
          price: project.price,
          result_url: project.resultUrl,
          failure_category: failureCategory,
          failure: failure,
          growth_point: project.growthPoint,
        }
      });
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      if (!user) {
        throw new BadRequestError('사용자 정보를 찾을 수 없습니다.');
      }

      const userId = user.userId;
      const projectId = parseInt(req.params.projectId);
      const updateProjectDto: UpdateProjectDto = req.body;

      if (isNaN(projectId)) {
        throw new BadRequestError('잘못된 프로젝트 ID입니다.');
      }

      // 빈 문자열("")인 필드를 undefined로 처리하여 누락된 것으로 간주
      const cleanedUpdateDto: UpdateProjectDto = {};
      for (const [key, value] of Object.entries(updateProjectDto)) {
        if (value !== "" && value !== null && value !== undefined) {
          cleanedUpdateDto[key as keyof UpdateProjectDto] = value;
        }
      }

      // 업데이트할 필드가 있는지 확인
      if (Object.keys(cleanedUpdateDto).length === 0) {
        throw new BadRequestError('업데이트할 필드가 없습니다.');
      }

      // failure 관련 검증 (failure_category와 failure가 모두 있는 경우)
      if (cleanedUpdateDto.failure_category || cleanedUpdateDto.failure) {
        if (!cleanedUpdateDto.failure_category) {
          throw new BadRequestError('failure_category 필드가 누락되었습니다. (참고: failure_cateory가 아닌 failure_category로 보내주세요)');
        }
        if (!cleanedUpdateDto.failure) {
          throw new BadRequestError('failure 필드가 누락되었습니다.');
        }

        if (cleanedUpdateDto.failure_category.length > 5 || cleanedUpdateDto.failure_category.length < 1) {
          throw new BadRequestError('잘못된 카테고리 개수 입니다.');
        }

        if (cleanedUpdateDto.failure_category.length !== cleanedUpdateDto.failure.length) {
          throw new BadRequestError('failure_category와 failure의 개수가 일치하지 않습니다.');
        }

        // 각 카테고리별 답변 검증
        for (let i = 0; i < cleanedUpdateDto.failure_category.length; i++) {
          const categoryName = cleanedUpdateDto.failure_category[i];
          const failureItem = cleanedUpdateDto.failure[i];
          
          if (!failureItem[categoryName]) {
            throw new BadRequestError(`카테고리 "${categoryName}"에 해당하는 답변이 없습니다.`);
          }

          const answers = failureItem[categoryName];
          
          if (answers.length !== 3) {
            throw new BadRequestError(`카테고리 "${categoryName}"의 답변은 3개여야 합니다.`);
          }

          for (let j = 0; j < 3; j++) {
            if (!answers[j] || answers[j].trim() === '') {
              throw new BadRequestError(`카테고리 "${categoryName}"의 ${j + 1}번째 답변이 비어있습니다.`);
            }
          }
        }
      }

      // 기타 필드 검증
      if (cleanedUpdateDto.personnel !== undefined && cleanedUpdateDto.personnel < 1) {
        throw new BadRequestError('인원이 한명 미만 입니다.');
      }

      if (cleanedUpdateDto.price !== undefined && cleanedUpdateDto.price < 0) {
        throw new BadRequestError('가격이 잘못된 값입니다.');
      }

      if (cleanedUpdateDto.sale_status && 
          cleanedUpdateDto.sale_status !== "NOTSALE" && 
          cleanedUpdateDto.sale_status !== "FREE" && 
          cleanedUpdateDto.sale_status !== "ONSALE") {
        throw new BadRequestError('sale_status가 잘못된 값입니다.');
      }

      // 프로젝트 업데이트
      const updatedProject = await this.projectService.updateProject(projectId, userId, cleanedUpdateDto);

      if (!updatedProject) {
        throw new BadRequestError('프로젝트 업데이트에 실패했습니다.');
      }

      // 응답 형식 변환
      const failureCategory = updatedProject.categories.map(cat => cat.category.name).filter(Boolean);
      const failure = updatedProject.categories.map(cat => ({
        [cat.category.name!]: [cat.answer1, cat.answer2, cat.answer3]
      }));

      res.status(200).json({
        success: true,
        code: 200,
        message: "글 수정 완료",
        data: {
          name: updatedProject.name,
          name_id: updatedProject.projectId,
          project_image: updatedProject.image,
          user: updatedProject.user.name,
          user_id: updatedProject.user.userId,
          nickname: updatedProject.user.nickname,
          profile_image: updatedProject.user.profileImage,
          period: updatedProject.period,
          personnel: updatedProject.personnel,
          intent: updatedProject.intent,
          my_role: updatedProject.myRole,
          sale_status: updatedProject.saleStatus,
          is_free: updatedProject.isFree ? "true" : "false",
          price: updatedProject.price,
          result_url: updatedProject.resultUrl,
          failure_category: failureCategory,
          failure: failure,
          growth_point: updatedProject.growthPoint,
        }
      });
    } catch (error) {
      next(error);
    }
  };
}


