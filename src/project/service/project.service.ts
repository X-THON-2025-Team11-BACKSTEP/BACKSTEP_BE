import { ProjectRepository } from '../repository/project.repository';
import { CreateProjectDto, FailureAnswer } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../common/error/AppError';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(userId: number, createProjectDto: CreateProjectDto) {
    // 프로젝트 생성
    const project = await this.projectRepository.createProject({
      userId,
      name: createProjectDto.name,
      period: createProjectDto.period,
      personnel: createProjectDto.personnel,
      intent: createProjectDto.intent,
      myRole: createProjectDto.my_role,
      saleStatus: createProjectDto.sale_status,
      isFree: createProjectDto.is_free,
      price: createProjectDto.price,
      resultUrl: createProjectDto.result_url,
      growthPoint: createProjectDto.growth_point,
      image: createProjectDto.image,
    });

    // 실패 카테고리 매핑 생성
    for (const failureItem of createProjectDto.failure) {
      for (const [categoryName, answers] of Object.entries(failureItem)) {
        // 카테고리 찾기
        const category = await this.projectRepository.findCategoryByName(categoryName);
        
        if (!category) {
          throw new NotFoundError(`카테고리를 찾을 수 없습니다: ${categoryName}`);
        }

        // 답변이 3개인지 확인
        if (answers.length !== 3) {
          throw new BadRequestError(`카테고리 "${categoryName}"의 답변은 3개여야 합니다.`);
        }

        // 프로젝트-카테고리 매핑 생성
        await this.projectRepository.createProjectCategoryMap({
          projectId: project.projectId,
          categoryId: category.categoryId,
          answer1: answers[0],
          answer2: answers[1],
          answer3: answers[2],
        });
      }
    }

    return project;
  }

  async getProject(projectId: number) {
    const project = await this.projectRepository.findById(projectId);
    
    if (!project) {
      throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
    }

    return project;
  }

  async updateProject(projectId: number, userId: number, updateProjectDto: UpdateProjectDto) {
    // 프로젝트 존재 확인
    const project = await this.projectRepository.findById(projectId);
    
    if (!project) {
      throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
    }

    // 프로젝트 소유자 확인
    if (project.userId !== userId) {
      throw new ForbiddenError('프로젝트를 수정할 권한이 없습니다.');
    }

    // 프로젝트 기본 정보 업데이트
    const updatedProject = await this.projectRepository.updateProject(projectId, {
      name: updateProjectDto.name,
      period: updateProjectDto.period,
      personnel: updateProjectDto.personnel,
      intent: updateProjectDto.intent,
      myRole: updateProjectDto.my_role,
      saleStatus: updateProjectDto.sale_status,
      isFree: updateProjectDto.is_free,
      price: updateProjectDto.price,
      resultUrl: updateProjectDto.result_url,
      growthPoint: updateProjectDto.growth_point,
      image: updateProjectDto.image,
    });

    // failure_category와 failure가 있으면 카테고리 매핑 업데이트
    if (updateProjectDto.failure_category && updateProjectDto.failure) {
      // 기존 카테고리 매핑 삭제
      await this.projectRepository.deleteProjectCategoryMaps(projectId);

      // 새로운 카테고리 매핑 생성
      for (const failureItem of updateProjectDto.failure) {
        for (const [categoryName, answers] of Object.entries(failureItem)) {
          // 카테고리 찾기
          const category = await this.projectRepository.findCategoryByName(categoryName);
          
          if (!category) {
            throw new NotFoundError(`카테고리를 찾을 수 없습니다: ${categoryName}`);
          }

          // 답변이 3개인지 확인
          if (answers.length !== 3) {
            throw new BadRequestError(`카테고리 "${categoryName}"의 답변은 3개여야 합니다.`);
          }

          // 프로젝트-카테고리 매핑 생성
          await this.projectRepository.createProjectCategoryMap({
            projectId: updatedProject.projectId,
            categoryId: category.categoryId,
            answer1: answers[0],
            answer2: answers[1],
            answer3: answers[2],
          });
        }
      }

      // 업데이트된 프로젝트 정보 다시 가져오기 (카테고리 포함)
      return await this.projectRepository.findById(projectId);
    }

    return updatedProject;
  }
}

