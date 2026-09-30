import { Controller, Get, Query } from '@nestjs/common';
import { AssembliesService } from './assemblies.service';
import { ListarAsambleasDto } from './models/listar-asambleas/listar-asambleas.dto';
import { ColegioId } from '../../auth/decorators/colegio.decorator';
import {
  ListarAsambleasInput,
  ListarAsambleasResponse,
} from './models/listar-asambleas/listar-asambleas.interface';

@Controller('assemblies')
export class AssembliesController {
  constructor(private readonly assembliesService: AssembliesService) {}

  @Get()
  async listarAsambleas(
    @ColegioId() colegio_id: number,
    @Query() query: ListarAsambleasDto,
  ): Promise<ListarAsambleasResponse> {
    const input: ListarAsambleasInput = {
      colegio_id,
      page: query.page,
      limit: query.limit,
      date_from: query.date_from,
      date_to: query.date_to,
    };
    const result = await this.assembliesService.listarAsambleas(input);
    return result;
  }
}
