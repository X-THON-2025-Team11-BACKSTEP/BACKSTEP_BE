import { SearchRepository } from '../repository/search.repository';
import { SearchDto } from '../dto/search.dto';

export class SearchService {
  private searchRepository: SearchRepository;

  constructor() {
    this.searchRepository = new SearchRepository();
  }

  async search(searchDto: SearchDto) {
    const { type, keyword, failure_category } = searchDto;

    if (type === 'project') {
      const projects = await this.searchRepository.searchProjects(keyword, failure_category);

      return {
        type: 'project',
        keyword: keyword || '',
        failure_category: failure_category || [],
        data: projects.map(project => ({
          name: project.name,
          name_id: project.projectId,
          project_image: project.image,
          user: project.user.name,
          user_id: project.user.userId,
          nickname: project.user.nickname,
          user_image: project.user.profileImage,
          period: project.period,
          sale_status: project.saleStatus,
          is_free: project.isFree ? "true" : "false",
          price: project.price,
          failure_category: project.categories.map(cat => cat.category.name).filter(Boolean),
        })),
      };
    } else if (type === 'user') {
      const users = await this.searchRepository.searchUsers(keyword);

      return {
        type: 'user',
        keyword: keyword || '',
        failure_category: failure_category || [],
        data: users.map(user => ({
          user: user.name,
          user_id: user.userId,
          nickname: user.nickname,
          user_image: user.profileImage,
        })),
      };
    }

    throw new Error('Invalid search type');
  }
}

