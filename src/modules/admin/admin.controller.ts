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
import { ColegiosService } from './colegios.service';
import { UsuariosService } from './usuarios.service';
import { CreateColegioDto } from './dto/create-colegio.dto';
import { UpdateColegioDto } from './dto/update-colegio.dto';
import { AssignUsuarioColegioDto } from './dto/assign-usuario-colegio.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Solo super_admin
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly colegiosService: ColegiosService,
    private readonly usuariosService: UsuariosService,
  ) {}

  // ========== COLEGIOS ==========

  @Get('colegios')
  @ApiOperation({ summary: 'Listar todos los colegios' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: 200, description: 'Lista de colegios' })
  findAllColegios(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.colegiosService.findAll(page, limit, search, isActive);
  }

  @Get('colegios/:id')
  @ApiOperation({ summary: 'Obtener un colegio por ID' })
  @ApiResponse({ status: 200, description: 'Colegio encontrado' })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado' })
  findOneColegio(@Param('id', ParseIntPipe) id: number) {
    return this.colegiosService.findOne(id);
  }

  @Post('colegios')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo colegio' })
  @ApiResponse({ status: 201, description: 'Colegio creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Slug ya existe' })
  createColegio(@Body() dto: CreateColegioDto) {
    return this.colegiosService.create(dto);
  }

  @Put('colegios/:id')
  @ApiOperation({ summary: 'Actualizar un colegio' })
  @ApiResponse({ status: 200, description: 'Colegio actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado' })
  @ApiResponse({ status: 409, description: 'Slug ya existe' })
  updateColegio(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateColegioDto,
  ) {
    return this.colegiosService.update(id, dto);
  }

  @Delete('colegios/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un colegio (soft delete)' })
  @ApiResponse({ status: 204, description: 'Colegio eliminado exitosamente' })
  @ApiResponse({ status: 409, description: 'Colegio tiene usuarios asociados' })
  removeColegio(@Param('id', ParseIntPipe) id: number) {
    return this.colegiosService.remove(id);
  }

  // ========== USUARIOS ==========

  @Get('usuarios')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAllUsuarios(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.usuariosService.findAll(page, limit, search);
  }

  @Get('usuarios/:id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOneUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Get('usuarios/:id/colegios')
  @ApiOperation({ summary: 'Listar colegios de un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de colegios del usuario' })
  findUsuarioColegios(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findColegios(id);
  }

  @Post('usuarios/:id/colegios')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Asignar usuario a un colegio' })
  @ApiResponse({ status: 201, description: 'Usuario asignado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario o colegio no encontrado' })
  assignUsuarioColegio(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignUsuarioColegioDto,
  ) {
    return this.usuariosService.assignColegio(id, dto.colegio_id, dto.role);
  }

  @Delete('usuarios/:id/colegios/:colegioId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover usuario de un colegio' })
  @ApiResponse({ status: 204, description: 'Usuario removido exitosamente' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  removeUsuarioColegio(
    @Param('id', ParseIntPipe) id: number,
    @Param('colegioId', ParseIntPipe) colegioId: number,
  ) {
    return this.usuariosService.removeColegio(id, colegioId);
  }

  @Delete('usuarios/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario (soft delete)' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar super admin o usuario con padres',
  })
  removeUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}
