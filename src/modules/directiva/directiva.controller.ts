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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DirectivaService } from './directiva.service';
import { CreateDirectivaDto } from './dto/create-directiva.dto';
import { UpdateDirectivaDto } from './dto/update-directiva.dto';
import { QueryDirectivaDto } from './dto/query-directiva.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ColegioId } from '../../auth/decorators/colegio.decorator';

@ApiTags('Directiva')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('directiva')
export class DirectivaController {
  constructor(private readonly directivaService: DirectivaService) {}

  @Get()
  @Roles(
    'admin_colegio',
    'presidente',
    'vicepresidente',
    'tesorero',
    'secretario',
    'vocal',
  )
  @ApiOperation({ summary: 'Listar miembros de la directiva del colegio' })
  @ApiResponse({ status: 200, description: 'Lista de miembros de directiva' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  findAll(@ColegioId() colegioId: number, @Query() query: QueryDirectivaDto) {
    return this.directivaService.findAll(colegioId, query);
  }

  @Get(':id')
  @Roles(
    'admin_colegio',
    'presidente',
    'vicepresidente',
    'tesorero',
    'secretario',
    'vocal',
  )
  @ApiOperation({ summary: 'Obtener un miembro de la directiva por ID' })
  @ApiResponse({ status: 200, description: 'Miembro encontrado' })
  @ApiResponse({ status: 404, description: 'Miembro no encontrado' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ColegioId() colegioId: number,
  ) {
    return this.directivaService.findOne(id, colegioId);
  }

  @Post()
  @Roles('admin_colegio', 'presidente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Asignar un padre a la directiva (crear mandato)' })
  @ApiResponse({ status: 201, description: 'Mandato creado exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'Mandato duplicado o rol ya ocupado',
  })
  @ApiResponse({ status: 404, description: 'Padre no encontrado' })
  create(@Body() dto: CreateDirectivaDto, @ColegioId() colegioId: number) {
    return this.directivaService.create(dto, colegioId);
  }

  @Put(':id')
  @Roles('admin_colegio', 'presidente')
  @ApiOperation({ summary: 'Actualizar un mandato de la directiva' })
  @ApiResponse({ status: 200, description: 'Mandato actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Mandato no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto de fechas o rol' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDirectivaDto,
    @ColegioId() colegioId: number,
  ) {
    return this.directivaService.update(id, dto, colegioId);
  }

  @Delete(':id')
  @Roles('admin_colegio', 'presidente')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un mandato de la directiva (soft delete)',
  })
  @ApiResponse({ status: 200, description: 'Mandato eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Mandato no encontrado' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ColegioId() colegioId: number,
  ) {
    return this.directivaService.remove(id, colegioId);
  }
}
