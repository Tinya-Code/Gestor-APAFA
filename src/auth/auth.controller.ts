import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Headers,
  UseGuards,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AsignarRolDto } from './dto/asignar-rol.dto';
import { SwitchColegioDto } from './dto/switch-colegio.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con token de Google/Firebase' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token de Firebase (Google Sign-In)',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Sesión iniciada exitosamente' })
  @ApiResponse({ status: 401, description: 'Token de Firebase inválido' })
  @ApiResponse({
    status: 403,
    description: 'No pertenece a ningún colegio',
  })
  async login(@Headers('authorization') auth: string) {
    const data = await this.authService.login(auth);
    return { data };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  async logout() {
    const data = await this.authService.logout();
    return { data };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async getProfile(
    @CurrentUser()
    user: {
      id: number;
      email: string;
      role: string;
      colegio_id: number | null;
      is_super_admin: boolean;
    },
  ) {
    const data = await this.authService.getProfile(
      user.id,
      user.colegio_id,
      user.is_super_admin,
    );
    return { data };
  }

  @Post('switch-colegio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cambiar de colegio activo (solo usuarios con múltiples colegios)',
  })
  @ApiResponse({ status: 200, description: 'Colegio cambiado exitosamente' })
  @ApiResponse({ status: 403, description: 'Usuario no pertenece al colegio' })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado' })
  async switchColegio(
    @CurrentUser() user: { id: number },
    @Body() dto: SwitchColegioDto,
  ) {
    const data = await this.authService.switchColegio(user.id, dto);
    return { data };
  }

  @Get('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin_colegio')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar roles disponibles (solo admin_colegio)' })
  @ApiResponse({ status: 200, description: 'Lista de roles' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  listRoles() {
    const data = this.authService.listRoles();
    return { data };
  }

  @Put('roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin_colegio')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Asignar/editar rol de un usuario (solo admin_colegio)',
  })
  @ApiResponse({ status: 200, description: 'Rol asignado exitosamente' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Usuario o colegio no encontrado' })
  async assignRole(
    @Param('id', ParseIntPipe) usuarioId: number,
    @Body() dto: AsignarRolDto,
  ) {
    const data = await this.authService.assignRole(usuarioId, dto);
    return { data };
  }
}
