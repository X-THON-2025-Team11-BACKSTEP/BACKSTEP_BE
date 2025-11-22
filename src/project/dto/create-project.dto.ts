import { SaleStatus } from '@prisma/client';

export interface FailureAnswer {
  [categoryName: string]: string[];
}

export interface CreateProjectDto {
  name: string;
  period: string;
  personnel: number;
  intent: string;
  my_role: string;
  sale_status: SaleStatus;
  is_free: boolean;
  price: number;
  result_url: string;
  failure_category: string[];
  failure: FailureAnswer[];
  growth_point: string;
}

