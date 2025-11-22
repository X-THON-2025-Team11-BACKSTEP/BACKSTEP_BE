import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../service/search.service';
import { SearchDto } from '../dto/search.dto';
import { BadRequestError } from '../../common/error/AppError';

export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      
      // failure_catagory 오타 처리 (failure_category로 정규화)
      const searchDto: SearchDto = {
        type: body.type,
        keyword: body.keyword,
        failure_category: body.failure_category || body.failure_catagory || [],
      };

      // type 검증
      if (!searchDto.type || (searchDto.type !== 'user' && searchDto.type !== 'project')) {
        throw new BadRequestError('type은 "user" 또는 "project"만 가능합니다.');
      }

      const result = await this.searchService.search(searchDto);

      res.status(200).json({
        success: true,
        code: 200,
        message: "검색 성공",
        data: {
          keyword: result.keyword,
          type: result.type,
          failure_category: result.failure_category,
          data_total: result.data.length,
          data_search: result.data,
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

