import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReemplazosService } from './reemplazos.service';
import { CreateReemplazoDto } from './dto/reemplazos/create-reemplazo.dto';
import { UpdateReemplazoDto } from './dto/reemplazos/update-reemplazo.dto';
import { QueryReemplazoDto } from './dto/reemplazos/query-reemplazo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ColegioId } from '../../auth/decorators/colegio.decorator';

@ApiTags('Directiva - Reemplazos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('directiva/reemplazos')
export class ReemplazosController {
  constructor(private readonly reemplazosService: ReemplazosService) {}

  @Get()
  @Roles('admin_colegio', 'presidente', 'vicepresidente', 'tesorero', 'secretario', 'vocal')
  @ApiOperation({ summary: 'Listar reemplazos de directiva del colegio' })
  @ApiResponse({ status: 200, description: 'Lista de reemplazos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  findAll(@ColegioId() colegioId: number, @Query() query: QueryReemplazoDto) {
    return this.reemplazosService.findAll(colegioId, query);
  }

  @Get(':id')
  @Roles('admin_colegio', 'presidente', 'vicepresidente', 'tesorero', 'secretario', 'vocal')
  @ApiOperation({ summary: 'Obtener un reemplazo por ID' })
  @ApiResponse({ status: 200, description: 'Reemplazo encontrado' })
  @ApiResponse({ status: 404, description: 'Reemplazo no encontrado' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ColegioId() colegioId: number,
  ) {
    return this.reemplazosService.findOne(id, colegioId);
  }

  @Post()
  @Roles('admin_colegio', 'presidente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un reemplazo temporal (autorizar vocal como suplente)' })
  @ApiResponse({ status: 201, description: 'Reemplazo creado exitosamente' })
  @ApiResponse({ status: 404, description: 'Vocal o directivo no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto: reemplazo ya existe o vocal ya tiene reemplazo activo' })
  create(
    @Body() dto: CreateReemplazoDto,
    @ColegioId() colegioId: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.reemplazosService.create(dto, colegioId, req.user.id);
  }

  @Put(':id')
  @Roles('admin_colegio', 'presidente')
  @ApiOperation({ summary: 'Actualizar un reemplazo (extender fecha, desactivar)' })
  @ApiResponse({ status: 200, description: 'Reemplazo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Reemplazo no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto de fechas' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReemplazoDto,
    @ColegioId() colegioId: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.reemplazosService.update(id, dto, colegioId, req.user.id);
  }

  @Delete(':id')
  @Roles('admin_colegio', 'presidente')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finalizar un reemplazo (el vocal vuelve a solo lectura)' })
  @ApiResponse({ status: 200, description: 'Reemplazo finalizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Reemplazo no encontrado' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ColegioId() colegioId: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.reemplazosService.remove(id, colegioId, req.user.id);
  }
}
