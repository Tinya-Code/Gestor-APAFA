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
  ApiQuery,
} from '@nestjs/swagger';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto/update-parent.dto';
import { QueryParentDto } from './dto/query-parent.dto/query-parent.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ColegioId } from '../../auth/decorators/colegio.decorator';

@ApiTags('Parents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Get()
  @Roles(
    'admin_colegio',
    'presidente',
    'vicepresidente',
    'tesorero',
    'secretario',
    'vocal',
  )
  @ApiOperation({ summary: 'Listar padres del colegio' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre, apellido o DNI',
  })
  @ApiResponse({ status: 200, description: 'Lista de padres' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  findAll(@ColegioId() colegioId: number, @Query() query: QueryParentDto) {
    return this.parentsService.findAll(
      colegioId,
      query.page,
      query.limit,
      query.search,
    );
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
  @ApiOperation({ summary: 'Obtener un padre por ID' })
  @ApiResponse({ status: 200, description: 'Padre encontrado' })
  @ApiResponse({ status: 404, description: 'Padre no encontrado' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ColegioId() colegioId: number,
  ) {
    return this.parentsService.findOne(id, colegioId);
  }

  @Post()
  @Roles('admin_colegio', 'presidente', 'vicepresidente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo padre' })
  @ApiResponse({ status: 201, description: 'Padre creado exitosamente' })
  @ApiResponse({ status: 409, description: 'DNI ya existe en el colegio' })
  create(@Body() dto: CreateParentDto, @ColegioId() colegioId: number) {
    return this.parentsService.create(dto, colegioId);
  }

  @Put(':id')
  @Roles('admin_colegio', 'presidente', 'vicepresidente')
  @ApiOperation({ summary: 'Actualizar un padre' })
  @ApiResponse({ status: 200, description: 'Padre actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Padre no encontrado' })
  @ApiResponse({ status: 409, description: 'DNI ya existe en el colegio' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateParentDto,
    @ColegioId() colegioId: number,
  ) {
    return this.parentsService.update(id, dto, colegioId);
  }

  @Delete(':id')
  @Roles('admin_colegio', 'presidente')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un padre (soft delete)' })
  @ApiResponse({ status: 204, description: 'Padre eliminado exitosamente' })
  @ApiResponse({
    status: 403,
    description: 'No se puede eliminar padre con hijos',
  })
  @ApiResponse({ status: 404, description: 'Padre no encontrado' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ColegioId() colegioId: number,
  ) {
    return this.parentsService.remove(id, colegioId);
  }
}
