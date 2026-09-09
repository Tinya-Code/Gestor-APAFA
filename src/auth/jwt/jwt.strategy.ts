/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import type { JwtPayload } from './jwt.service';
import type {
  UsuarioRow,
  UsuarioColegioRow,
} from '../../shared/types/usuario.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly db: DatabaseService,
  ) {
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });
  }

  async validate(payload: JwtPayload) {
    // Super admin: no necesita colegio
    if (payload.is_super_admin) {
      const [usuarios] = await this.db.query<UsuarioRow[]>(
        'SELECT id, email, name, surname, is_super_admin FROM usuario WHERE id = ? AND deleted_at IS NULL',
        [payload.sub],
      );

      if (!usuarios.length) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const usuario = usuarios[0];

      return {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
        surname: usuario.surname,
        role: 'admin',
        colegio_id: null,
        is_super_admin: true,
      };
    }

    // Usuario normal: necesita colegio
    if (!payload.colegio_id) {
      throw new UnauthorizedException('Token sin colegio asociado');
    }

    const [usuarios] = await this.db.query<UsuarioRow[]>(
      'SELECT id, email, name, surname, is_super_admin FROM usuario WHERE id = ? AND deleted_at IS NULL',
      [payload.sub],
    );

    if (!usuarios.length) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const usuario = usuarios[0];

    const [usuarioColegios] = await this.db.query<UsuarioColegioRow[]>(
      `SELECT uc.id, uc.usuario_id, uc.colegio_id, uc.role, c.name as colegio_name
       FROM usuario_colegio uc
       JOIN colegio c ON c.id = uc.colegio_id
       WHERE uc.usuario_id = ? AND uc.colegio_id = ? AND uc.is_active = 1`,
      [usuario.id, payload.colegio_id],
    );

    if (!usuarioColegios.length) {
      throw new UnauthorizedException('Usuario no pertenece a este colegio');
    }

    const uc = usuarioColegios[0];

    return {
      id: usuario.id,
      email: usuario.email,
      name: usuario.name,
      surname: usuario.surname,
      role: uc.role,
      colegio_id: uc.colegio_id,
      colegio_name: uc.colegio_name,
      is_super_admin: false,
    };
  }
}
