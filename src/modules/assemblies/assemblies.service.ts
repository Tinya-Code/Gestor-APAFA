import { Injectable } from '@nestjs/common';
import { TotalPagesService } from './shared/total-pages/total-pages.service';
import { ListarAsambleaRepository } from './repository/listar-asamblea.repository/listar-asamblea.repository';
import {
  ListarAsambleasInput,
  ListarAsambleasResponse,
} from './models/listar-asambleas/listar-asambleas.interface';

@Injectable()
export class AssembliesService {
  constructor(
    private readonly totalPagesService: TotalPagesService,
    private readonly listarAsambleaRepository: ListarAsambleaRepository,
  ) {}
  // caso de uso: Listar asambleas
  async listarAsambleas(
    input: ListarAsambleasInput,
  ): Promise<ListarAsambleasResponse> {
    const asambleas =
      await this.listarAsambleaRepository.listarAsambleas(input);
    const { total, totalPages } =
      await this.totalPagesService.totalPages(input);
    const response: ListarAsambleasResponse = {
      data: asambleas,
      pagination: {
        page: input.page!,
        limit: input.limit!,
        total,
        total_pages: totalPages,
      },
    };
    return response;
  }
}
