import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase/firebase.service';
import { JwtAuthService } from './jwt/jwt.service';
import { DatabaseService } from '../database/database.service';
import { parseExpirationToSeconds } from '../shared/helpers/expiration.helper';
import { AsignarRolDto } from './dto/asignar-rol.dto';
import { SwitchColegioDto } from './dto/switch-colegio.dto';
import type {
  LoginResponse,
  PerfilResponse,
  AsignarRolResponse,
  SwitchColegioResponse,
} from './entities/auth-response.interface';
import type {
  UsuarioRow,
  UsuarioColegioRow,
  ColegioRow,
} from '../shared/types/usuario.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly expiresInSeconds: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly db: DatabaseService,
  ) {
    this.expiresInSeconds = parseExpirationToSeconds(
      this.configService.get<string>('JWT_EXPIRATION', '86400'),
    );
  }

  async login(authHeader: string): Promise<LoginResponse> {
    const firebaseToken = this.extractBearerToken(authHeader);
    const firebaseUser = await this.firebaseService.verifyToken(firebaseToken);

    // Buscar usuario por email
    const usuarios = await this.db.query<UsuarioRow[]>(
      'SELECT id, email, name, surname, phone, is_super_admin FROM usuario WHERE email = ? AND deleted_at IS NULL',
      [firebaseUser.email],
    );

    if (!usuarios.length) {
      throw new ForbiddenException('Correo no registrado en el sistema');
    }

    const usuario = usuarios[0];

    // Super admin: no necesita colegio
    if (usuario.is_super_admin) {
      const accessToken = await this.jwtAuthService.generateToken({
        id: usuario.id,
        email: usuario.email,
        role: 'admin',
        colegio_id: null,
        is_super_admin: true,
      });

      return {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: this.expiresInSeconds,
        user: {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
          surname: usuario.surname,
          role: 'admin',
          colegio_id: null,
          colegio_name: null,
          is_super_admin: true,
        },
      };
    }

    // Usuario normal: necesita al menos un colegio
    const usuarioColegios = await this.db.query<UsuarioColegioRow[]>(
      `SELECT uc.id, uc.usuario_id, uc.colegio_id, uc.role, c.name as colegio_name
       FROM usuario_colegio uc
       JOIN colegio c ON c.id = uc.colegio_id
       WHERE uc.usuario_id = ? AND uc.is_active = 1
       ORDER BY uc.created_at ASC
       LIMIT 1`,
      [usuario.id],
    );

    if (!usuarioColegios.length) {
      throw new ForbiddenException('El usuario no pertenece a ningún colegio');
    }

    const uc = usuarioColegios[0];

    const accessToken = await this.jwtAuthService.generateToken({
      id: usuario.id,
      email: usuario.email,
      role: uc.role,
      colegio_id: uc.colegio_id,
      is_super_admin: false,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: this.expiresInSeconds,
      user: {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
        surname: usuario.surname,
        role: uc.role,
        colegio_id: uc.colegio_id,
        colegio_name: uc.colegio_name,
        is_super_admin: false,
      },
    };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Sesión cerrada exitosamente' };
  }

  async getProfile(
    userId: number,
    colegioId: number | null,
    isSuperAdmin: boolean,
  ): Promise<PerfilResponse> {
    const usuarios = await this.db.query<UsuarioRow[]>(
      'SELECT id, email, name, surname, phone, is_super_admin FROM usuario WHERE id = ? AND deleted_at IS NULL',
      [userId],
    );

    if (!usuarios.length) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const usuario = usuarios[0];

    // Super admin: retorna perfil sin colegio
    if (isSuperAdmin) {
      return {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
        surname: usuario.surname,
        dni: null,
        phone: usuario.phone,
        role: 'admin',
        colegio_id: null,
        colegio_name: null,
        is_super_admin: true,
      };
    }

    // Usuario normal: necesita colegio
    if (!colegioId) {
      throw new UnauthorizedException('Token sin colegio asociado');
    }

    const usuarioColegios = await this.db.query<UsuarioColegioRow[]>(
      `SELECT uc.id, uc.usuario_id, uc.colegio_id, uc.role, c.name as colegio_name
       FROM usuario_colegio uc
       JOIN colegio c ON c.id = uc.colegio_id
       WHERE uc.usuario_id = ? AND uc.colegio_id = ? AND uc.is_active = 1`,
      [userId, colegioId],
    );

    if (!usuarioColegios.length) {
      throw new ForbiddenException('Usuario no pertenece a este colegio');
    }

    const uc = usuarioColegios[0];

    return {
      id: usuario.id,
      email: usuario.email,
      name: usuario.name,
      surname: usuario.surname,
      dni: null,
      phone: usuario.phone,
      role: uc.role,
      colegio_id: uc.colegio_id,
      colegio_name: uc.colegio_name,
      is_super_admin: false,
    };
  }

  async switchColegio(
    userId: number,
    dto: SwitchColegioDto,
  ): Promise<SwitchColegioResponse> {
    // Verificar que el usuario existe
    const usuarios = await this.db.query<UsuarioRow[]>(
      'SELECT id, email, name, surname, is_super_admin FROM usuario WHERE id = ? AND deleted_at IS NULL',
      [userId],
    );

    if (!usuarios.length) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const usuario = usuarios[0];

    // Super admin: puede cambiar a cualquier colegio sin verificar membresía
    if (usuario.is_super_admin) {
      const colegios = await this.db.query<ColegioRow[]>(
        'SELECT id, name, slug FROM colegio WHERE id = ? AND is_active = 1 AND deleted_at IS NULL',
        [dto.colegio_id],
      );

      if (!colegios.length) {
        throw new NotFoundException('Colegio no encontrado o inactivo');
      }

      const uc = { role: 'admin', colegio_name: colegios[0].name };

      const accessToken = await this.jwtAuthService.generateToken({
        id: usuario.id,
        email: usuario.email,
        role: uc.role,
        colegio_id: dto.colegio_id,
        is_super_admin: true, // ← MANTIENE super admin
      });

      return {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: this.expiresInSeconds,
        user: {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
          surname: usuario.surname,
          role: uc.role,
          colegio_id: dto.colegio_id,
          colegio_name: uc.colegio_name,
          is_super_admin: true, // ← MANTIENE super admin
        },
      };
    }

    // Usuario normal: verificar que el colegio existe y está activo
    const colegios = await this.db.query<ColegioRow[]>(
      'SELECT id, name, slug FROM colegio WHERE id = ? AND is_active = 1 AND deleted_at IS NULL',
      [dto.colegio_id],
    );

    if (!colegios.length) {
      throw new NotFoundException('Colegio no encontrado o inactivo');
    }

    // Verificar que el usuario pertenece al colegio
    const usuarioColegios = await this.db.query<UsuarioColegioRow[]>(
      `SELECT uc.id, uc.usuario_id, uc.colegio_id, uc.role, c.name as colegio_name
       FROM usuario_colegio uc
       JOIN colegio c ON c.id = uc.colegio_id
       WHERE uc.usuario_id = ? AND uc.colegio_id = ? AND uc.is_active = 1`,
      [userId, dto.colegio_id],
    );

    if (!usuarioColegios.length) {
      throw new ForbiddenException('Usuario no pertenece a este colegio');
    }

    const uc = usuarioColegios[0];

    // Generar nuevo token con el colegio seleccionado
    const accessToken = await this.jwtAuthService.generateToken({
      id: usuario.id,
      email: usuario.email,
      role: uc.role,
      colegio_id: uc.colegio_id,
      is_super_admin: false,
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: this.expiresInSeconds,
      user: {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
        surname: usuario.surname,
        role: uc.role,
        colegio_id: uc.colegio_id,
        colegio_name: uc.colegio_name,
        is_super_admin: false,
      },
    };
  }

  listRoles(): { name: string; description: string }[] {
    return [
      { name: 'admin_colegio', description: 'Administrador del colegio' },
      { name: 'presidente', description: 'Presidente de la APAFA' },
      { name: 'vicepresidente', description: 'Vicepresidente de la APAFA' },
      { name: 'tesorero', description: 'Tesorero de la APAFA' },
      { name: 'secretario', description: 'Secretario de la APAFA' },
      { name: 'vocal', description: 'Vocal (solo lectura)' },
      { name: 'padre', description: 'Padre de familia (acceso limitado)' },
    ];
  }

  async assignRole(
    usuarioId: number,
    dto: AsignarRolDto,
  ): Promise<AsignarRolResponse> {
    // Verificar que el usuario existe
    const usuarios = await this.db.query<UsuarioRow[]>(
      'SELECT id FROM usuario WHERE id = ? AND deleted_at IS NULL',
      [usuarioId],
    );

    if (!usuarios.length) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el colegio existe
    const colegios = await this.db.query<ColegioRow[]>(
      'SELECT id FROM colegio WHERE id = ? AND is_active = 1 AND deleted_at IS NULL',
      [dto.colegio_id],
    );

    if (!colegios.length) {
      throw new NotFoundException('Colegio no encontrado');
    }

    // Verificar si ya existe la relación
    const existente = await this.db.query<UsuarioColegioRow[]>(
      'SELECT id FROM usuario_colegio WHERE usuario_id = ? AND colegio_id = ?',
      [usuarioId, dto.colegio_id],
    );

    if (existente.length) {
      // Actualizar rol existente
      await this.db.execute(
        'UPDATE usuario_colegio SET role = ?, updated_at = NOW() WHERE usuario_id = ? AND colegio_id = ?',
        [dto.role, usuarioId, dto.colegio_id],
      );

      return {
        id: existente[0].id,
        usuario_id: usuarioId,
        colegio_id: dto.colegio_id,
        role: dto.role,
        updated_at: new Date().toISOString(),
      };
    } else {
      // Crear nueva relación
      const result = await this.db.execute(
        'INSERT INTO usuario_colegio (usuario_id, colegio_id, role) VALUES (?, ?, ?)',
        [usuarioId, dto.colegio_id, dto.role],
      );

      return {
        id: result.insertId,
        usuario_id: usuarioId,
        colegio_id: dto.colegio_id,
        role: dto.role,
        updated_at: new Date().toISOString(),
      };
    }
  }

  private extractBearerToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    return authHeader.slice(7);
  }
}
