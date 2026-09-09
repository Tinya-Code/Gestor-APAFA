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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto/query-student.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ColegioId } from '../../auth/decorators/colegio.decorator';

@ApiTags('Students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Roles(
    'admin_colegio',
    'presidente',
    'vicepresidente',
    'tesorero',
    'secretario',
    'vocal',
  )
  @ApiOperation({ summary: 'Listar estudiantes del colegio' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre o apellido',
  })
  @ApiQuery({
    name: 'grade',
    required: false,
    description: 'Filtrar por grado',
  })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  findAll(@ColegioId() colegioId: number, @Query() query: QueryStudentDto) {
    return this.studentsService.findAll(
      colegioId,
      query.page,
      query.limit,
      query.search,
      query.grade,
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
  @ApiOperation({ summary: 'Obtener un estudiante por ID' })
  @ApiResponse({ status: 200, description: 'Estudiante encontrado' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ColegioId() colegioId: number,
  ) {
    return this.studentsService.findOne(id, colegioId);
  }

  @Post()
  @Roles('admin_colegio', 'presidente', 'vicepresidente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo estudiante' })
  @ApiResponse({ status: 201, description: 'Estudiante creado exitosamente' })
  @ApiResponse({ status: 404, description: 'Padre no encontrado' })
  create(@Body() dto: CreateStudentDto, @ColegioId() colegioId: number) {
    return this.studentsService.create(dto, colegioId);
  }

  @Put(':id')
  @Roles('admin_colegio', 'presidente', 'vicepresidente')
  @ApiOperation({ summary: 'Actualizar un estudiante' })
  @ApiResponse({
    status: 200,
    description: 'Estudiante actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Estudiante o padre no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
    @ColegioId() colegioId: number,
  ) {
    return this.studentsService.update(id, dto, colegioId);
  }

  @Delete(':id')
  @Roles('admin_colegio', 'presidente')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un estudiante (soft delete)' })
  @ApiResponse({
    status: 204,
    description: 'Estudiante eliminado exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No se puede eliminar estudiante con asistencias',
  })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ColegioId() colegioId: number,
  ) {
    return this.studentsService.remove(id, colegioId);
  }
}
