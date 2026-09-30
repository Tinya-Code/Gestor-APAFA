import { Injectable } from '@nestjs/common';
import { TotalPagesRepository } from './repository/total-pages.repository';
import {
  TotalPagesInput,
  TotalPagesResponse,
} from './interface/total-pages.interface';

@Injectable()
export class TotalPagesService {
  constructor(private readonly totalPagesRepository: TotalPagesRepository) {}
  async totalPages(input: TotalPagesInput): Promise<TotalPagesResponse> {
    const totalPages = await this.totalPagesRepository.getTotalPages(
      input.colegio_id,
      input.limit,
      input.date_from,
      input.date_to,
    );
    return { totalPages };
  }
}
