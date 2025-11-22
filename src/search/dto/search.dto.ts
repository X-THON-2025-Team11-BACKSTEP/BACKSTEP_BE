export interface SearchDto {
  type: 'user' | 'project';
  keyword?: string;
  failure_category?: string[];
}

