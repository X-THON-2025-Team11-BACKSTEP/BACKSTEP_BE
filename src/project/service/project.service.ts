import { ProjectRepository } from '../repository/project.repository';
import { CreateProjectDto, FailureAnswer } from '../dto/create-project.dto';
import { BadRequestError, NotFoundError } from '../../common/error/AppError';

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
}

