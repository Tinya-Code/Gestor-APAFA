# A9 — Infraestructura Complementaria

### Pregunta

> ¿Qué necesita el sistema para ser robusto?

---

Aquí aparecen únicamente cuando son necesarios. No forman parte del código base; se incorporan cuando el proyecto los necesita.

Stack: **NestJS** (backend) + **Angular** (frontend) — Este documento es solo para el backend.

---

## 1. Flujo de Autenticación Completo

### Diagrama General

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. CLIENTE → POST /api/v1/auth/login                               │
│     Header: Authorization: Bearer <firebase_token>                  │
│                                                                     │
│  2. FirebaseService.verifyToken()                                   │
│     ┌────────────────────────────────────────────┐                  │
│     │ Firebase Admin SDK                          │                  │
│     │ verifyIdToken(firebase_token)               │                  │
│     │ → { uid, email, name }                      │                  │
│     │ ⚠️ NO contiene roles del sistema            │                  │
│     └────────────────────────────────────────────┘                  │
│                                                                     │
│  3. AuthService.login() busca en MySQL                              │
│     ┌────────────────────────────────────────────┐                  │
│     │ SELECT * FROM usuario                      │                  │
│     │ WHERE email = ? AND deleted_at IS NULL      │                  │
│     └────────────────────────────────────────────┘                  │
│                          ↓                                          │
│     ┌────────────────────────────────────────────┐                  │
│     │ Si es super_admin → JWT con colegio_id=null │                  │
│     │ Si no → SELECT * FROM usuario_colegio       │                  │
│     │ WHERE usuario_id = ? AND is_active = 1      │                  │
│     │ → { role, colegio_id, colegio_name }        │                  │
│     └────────────────────────────────────────────┘                  │
│                                                                     │
│  4. JwtAuthService.generateToken()                                  │
│     ┌────────────────────────────────────────────┐                  │
│     │ JWT interno (NestJS):                       │                  │
│     │ {                                           │                  │
│     │   sub: usuario.id,   ← de MySQL             │                  │
│     │   email: email,      ← de MySQL             │                  │
│     │   role: uc.role,     ← de MySQL             │                  │
│     │   colegio_id: uc.colegio_id, ← de MySQL     │                  │
│     │   is_super_admin: boolean                    │                  │
│     │ }                                           │                  │
│     │ ⚠️ El rol VIENE DE MYSQL, no de Firebase   │                  │
│     └────────────────────────────────────────────┘                  │
│                                                                     │
│  5. RESPUESTA AL CLIENTE                                            │
│     { access_token: "eyJ...", user: { id, email, role,             │
│       colegio_id, colegio_name, is_super_admin } }                 │
│                                                                     │
│  6. PETICIONES SUBSECUENTES                                         │
│     Header: Authorization: Bearer <jwt_interno>                     │
│     → JwtStrategy valida el JWT                                     │
│     → RolesGuard verifica user.role                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Resumen de Tokens

| Token | Quién lo crea | Contiene | Para qué sirve |
|-------|---------------|----------|----------------|
| **Firebase Token** | Firebase Auth (cliente) | uid, email, name | Identificar usuario en Firebase |
| **JWT Interno** | NestJS (backend) | sub, email, role, colegio_id, is_super_admin | Autenticar peticiones a la API |

**Importante:** El rol del usuario **NUNCA** viene de Firebase. Siempre se obtiene de MySQL (tablas `usuario` + `usuario_colegio`).

---

## 2. Seguridad

### Firebase Admin SDK

```typescript
// config/firebase.config.ts
import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let firebaseApp: App;

function getFirebaseApp(): App {
  if (!firebaseApp) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId: process.env['FIREBASE_PROJECT_ID'],
        privateKey: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
        clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
      }),
    });
  }
  return firebaseApp;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
```

### Firebase Service (verificación de token)

```typescript
// auth/firebase/firebase.service.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { getFirebaseAuth } from '../../config/firebase.config';

export interface FirebaseTokenPayload {
  uid: string;
  email: string;
  name: string;
}

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  async verifyToken(idToken: string): Promise<FirebaseTokenPayload> {
    try {
      const auth = getFirebaseAuth();
      const decodedToken = await auth.verifyIdToken(idToken);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email ?? '',
        name: decodedToken.name ?? decodedToken.email ?? '',
      };
    } catch (_error) {
      this.logger.warn('Firebase token verification failed');
      throw new UnauthorizedException('Token de Firebase inválido o expirado');
    }
  }
}
```

### JWT Service (generación y verificación)

```typescript
// auth/jwt/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: number;           // ID del usuario en MySQL
  email: string;
  role: string;          // Rol EN el colegio (o 'admin' para super_admin)
  colegio_id: number | null;  // ID del colegio activo (null para super_admin)
  is_super_admin: boolean;
}

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: {
    id: number;
    email: string;
    role: string;
    colegio_id: number | null;
    is_super_admin: boolean;
  }): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      colegio_id: user.colegio_id,
      is_super_admin: user.is_super_admin,
    };
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
```

### JWT Strategy (validación en cada petición)

```typescript
// src/auth/jwt/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import type { JwtPayload } from './jwt.service';
import type { UsuarioRow, UsuarioColegioRow } from '../../shared/types/usuario.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly db: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
```

---

## 3. Guards

### JWT Auth Guard

```typescript
// auth/guards/jwt-auth.guard.ts
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Roles Guard (con bypass de super admin y admin_colegio)

```typescript
// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly db: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ✅ SUPER ADMIN BYPASS: tiene acceso TOTAL
    if (user?.is_super_admin === true) {
      return true;
    }

    // ✅ ADMIN COLEGIO BYPASS: acceso total EN SU colegio
    if (user?.role === 'admin_colegio') {
      return true;
    }

    // Determinar el rol efectivo del usuario
    let effectiveRole = user?.role;

    // ✅ REEMPLAZO TEMPORAL: Si es vocal, verificar si tiene un reemplazo activo
    if (user?.role === 'vocal' && user?.id && user?.colegio_id) {
      const [reemplazos] = await this.db.query(
        `SELECT effective_role
         FROM directiva_reemplazo
         WHERE vocal_parent_id = (
           SELECT id FROM padre WHERE usuario_id = ? AND colegio_id = ? AND deleted_at IS NULL LIMIT 1
         )
         AND colegio_id = ? AND is_active = 1
         AND (end_date IS NULL OR end_date > NOW())
         AND deleted_at IS NULL
         ORDER BY created_at DESC
         LIMIT 1`,
        [user.id, user.colegio_id, user.colegio_id],
      );

      if (reemplazos.length > 0) {
        effectiveRole = reemplazos[0].effective_role;
      }
    }

    // Guardar el rol efectivo en el request para uso posterior
    request.user = {
      ...user,
      effective_role: effectiveRole,
    };

    // Para otros roles, verificar que estén en la lista
    if (!user || !requiredRoles.includes(effectiveRole)) {
      throw new ForbiddenException('Permisos insuficientes');
    }

    return true;
  }
}
```

> **Nota:** El `admin_colegio` tiene bypass total EN SU colegio. No necesita estar en la lista de `@Roles()` para acceder a endpoints protegidos dentro de su colegio.
>
> **Reemplazos Temporales:** Cuando un vocal tiene un reemplazo activo, el RolesGuard usa `effective_role` (el rol que reemplaza) en lugar de `vocal` para la autorización. Esto permite que el vocal acceda a los endpoints del rol que está reemplazando.

### Roles Decorator

```typescript
// auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

### Constantes de Roles

```typescript
// src/auth/constants/roles.constant.ts
/**
 * Roles del sistema APAFA.
 *
 * REGLA: El rol 'admin' es exclusivo para super admins (desarrolladores).
 * - Tiene acceso TOTAL a todos los colegios (bypass de RolesGuard).
 * - NUNCA debe aparecer en listados de padres o directiva.
 * - Todas las queries de listado deben excluir: WHERE is_super_admin = 0
 *
 * REGLA: El rol 'admin_colegio' tiene bypass total EN SU colegio.
 * - Accede a todos los endpoints dentro de su colegio.
 * - No necesita estar en la lista de @Roles() para acceder.
 */
export const ROLES = {
  ADMIN: 'admin', // Super admin (desarrollador)
  ADMIN_COLEGIO: 'admin_colegio', // Administrador del colegio
  PRESIDENTE: 'presidente',
  VICEPRESIDENTE: 'vicepresidente',
  TESORERO: 'tesorero',
  SECRETARIO: 'secretario',
  VOCAL: 'vocal',
  PADRE: 'padre',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Roles que pueden acceder a la directiva (admin del colegio y roles directivos)
 */
export const DIRECTIVA_ROLES: readonly string[] = [
  ROLES.ADMIN_COLEGIO,
  ROLES.PRESIDENTE,
  ROLES.VICEPRESIDENTE,
  ROLES.TESORERO,
  ROLES.SECRETARIO,
  ROLES.VOCAL,
];
```

### @ColegioId Decorator

```typescript
// src/auth/decorators/colegio-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extrae el colegio_id del JWT del usuario autenticado.
 * Uso: @ColegioId() colegioId: number
 *
 * Retorna null si el usuario es super_admin (colegio_id=null en JWT).
 */
export const ColegioId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.colegio_id ?? null;
  },
);
```

### Uso en Controllers

```typescript
// src/modules/parents/parents.controller.ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parents')
export class ParentsController {
  
  @Get()
  @Roles('admin_colegio', 'presidente', 'vicepresidente', 'tesorero', 'secretario', 'vocal')
  findAll(@ColegioId() colegioId: number) { ... }

  @Post()
  @Roles('admin_colegio', 'presidente', 'vicepresidente')
  create(@Body() dto: CreateParentDto, @ColegioId() colegioId: number) { ... }

  @Put(':id')
  @Roles('admin_colegio', 'presidente', 'vicepresidente')
  update(@Param('id') id: number, @Body() dto: UpdateParentDto, @ColegioId() colegioId: number) { ... }

  @Delete(':id')
  @Roles('admin_colegio', 'presidente')
  remove(@Param('id') id: number, @ColegioId() colegioId: number) { ... }
}
```

> **Nota:** El decorator `@Roles('admin')` en `DELETE` es redundante porque el admin ya tiene bypass total, pero se mantiene por claridad de intención.

### Modelo de Seguridad — Doble Capa

```
┌─────────────────────────────────────────────────────────────────┐
│              PROTECCIÓN DEL BACKEND                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Cualquier cliente (Angular, Postman, curl)                      │
│                          ↓                                       │
│  ┌────────────────────────────────────────────────┐              │
│  │ CAPA 1: JwtAuthGuard                           │              │
│  │ → ¿Hay token? No → 401 UNAUTHORIZED            │              │
│  │ → ¿Token válido? No → 401 UNAUTHORIZED         │              │
│  │ → ¿Token expirado? No → 401 UNAUTHORIZED       │              │
│  └────────────────────────────────────────────────┘              │
│                          ↓ ✅ Pasa                               │
│  ┌────────────────────────────────────────────────┐              │
│  │ CAPA 2: RolesGuard                             │              │
│  │ → ¿Es super_admin? → BYPASS TOTAL → ✅ Pasa    │              │
│  │ → ¿Es admin_colegio? → BYPASS COLEGIO → ✅ Pasa│              │
│  │ → ¿Tiene el rol requerido? → ✅ Pasa           │              │
│  │ → No tiene el rol → 403 FORBIDDEN               │              │
│  └────────────────────────────────────────────────┘              │
│                          ↓ ✅ Pasa                               │
│  ┌────────────────────────────────────────────────┐              │
│  │ CONTROLADOR EJECUTA LA ACCIÓN                   │              │
│  └────────────────────────────────────────────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tabla de Comportamiento

| Escenario | JwtAuthGuard | RolesGuard | Resultado |
|-----------|:------------:|:----------:|-----------|
| Sin token | ❌ | — | **401** Token no proporcionado |
| Token expirado | ❌ | — | **401** Token expirado |
| Token inválido | ❌ | — | **401** Token inválido |
| Token válido, sin rol | — | ❌ | **403** Permisos insuficientes |
| Token válido, rol incorrecto | ✅ | ❌ | **403** Permisos insuficientes |
| Token válido, rol correcto | ✅ | ✅ | **200 OK** |
| Token de super_admin | ✅ | ✅ (bypass total) | **200 OK** |
| Token de admin_colegio | ✅ | ✅ (bypass colegio) | **200 OK** |

**Conclusión:** Sin un JWT interno válido y con el rol adecuado, no se puede hacer NADA en el backend. Ni Postman, ni curl, ni ningún otro cliente puede evadir estas dos capas de seguridad.

### Configuración Global

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

### DTOs con class-validator

```typescript
// src/modules/parents/dto/create-parent.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParentDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del padre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del padre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  surname: string;

  @ApiProperty({ example: '30123456', description: 'DNI del padre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dni: string;

  @ApiPropertyOptional({ example: '+5491155551234', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'juan@email.com', description: 'Email' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID del usuario asociado (opcional)' })
  @IsOptional()
  @IsNumber()
  usuario_id?: number;
}
```

---

## 4. Auth Service (corazón del login)

```typescript
// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';
import { JwtAuthService } from './jwt/jwt.service';
import { DatabaseService } from '../database/database.service';
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

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly db: DatabaseService,
  ) {}

  async login(authHeader: string): Promise<LoginResponse> {
    // 1. Extraer token Firebase del header
    const firebaseToken = this.extractBearerToken(authHeader);

    // 2. Verificar con Firebase → obtiene email
    const firebaseUser = await this.firebaseService.verifyToken(firebaseToken);

    // 3. Buscar usuario en MySQL por email
    const [usuarios] = await this.db.query<UsuarioRow[]>(
      'SELECT id, email, name, surname, phone, is_super_admin FROM usuario WHERE email = ? AND deleted_at IS NULL',
      [firebaseUser.email],
    );

    if (!usuarios.length) {
      throw new ForbiddenException('Correo no registrado en el sistema');
    }

    const usuario = usuarios[0];

    // 4. Super admin → JWT con colegio_id = null
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
        expires_in: 86400,
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

    // 5. Usuario normal → buscar colegio en usuario_colegio
    const [usuarioColegios] = await this.db.query<UsuarioColegioRow[]>(
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

    // 6. Crear JWT interno con el rol y colegio de MySQL
    const accessToken = await this.jwtAuthService.generateToken({
      id: usuario.id,
      email: usuario.email,
      role: uc.role,
      colegio_id: uc.colegio_id,
      is_super_admin: false,
    });

    // 7. Retornar JWT + datos del usuario
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 86400,
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

  async getProfile(
    userId: number,
    colegioId: number | null,
    isSuperAdmin: boolean,
  ): Promise<PerfilResponse> {
    const [usuarios] = await this.db.query<UsuarioRow[]>(
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

    const [usuarioColegios] = await this.db.query<UsuarioColegioRow[]>(
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
    const [usuarios] = await this.db.query<UsuarioRow[]>(
      'SELECT id, email, name, surname, is_super_admin FROM usuario WHERE id = ? AND deleted_at IS NULL',
      [userId],
    );

    if (!usuarios.length) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const usuario = usuarios[0];

    // Super admin: puede cambiar a cualquier colegio sin verificar membresía
    if (usuario.is_super_admin) {
      const [colegios] = await this.db.query<ColegioRow[]>(
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
        expires_in: 86400,
        user: {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
          surname: usuario.surname,
          role: uc.role,
          colegio_id: dto.colegio_id,
          colegio_name: uc.colegio_name,
          is_super_admin: true,
        },
      };
    }

    // Usuario normal: verificar que el colegio existe y está activo
    const [colegios] = await this.db.query<ColegioRow[]>(
      'SELECT id, name, slug FROM colegio WHERE id = ? AND is_active = 1 AND deleted_at IS NULL',
      [dto.colegio_id],
    );

    if (!colegios.length) {
      throw new NotFoundException('Colegio no encontrado o inactivo');
    }

    // Verificar que el usuario pertenece al colegio
    const [usuarioColegios] = await this.db.query<UsuarioColegioRow[]>(
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
      expires_in: 86400,
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
    const [usuarios] = await this.db.query<UsuarioRow[]>(
      'SELECT id FROM usuario WHERE id = ? AND deleted_at IS NULL',
      [usuarioId],
    );

    if (!usuarios.length) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const [colegios] = await this.db.query<ColegioRow[]>(
      'SELECT id FROM colegio WHERE id = ? AND is_active = 1 AND deleted_at IS NULL',
      [dto.colegio_id],
    );

    if (!colegios.length) {
      throw new NotFoundException('Colegio no encontrado');
    }

    // Verificar si ya existe la relación
    const [existente] = await this.db.query<UsuarioColegioRow[]>(
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
```

### Regla del Super Admin (rol de desarrollador)

```sql
-- El super admin se registra en usuario con is_super_admin = 1
INSERT INTO usuario (email, firebase_uid, name, surname, is_super_admin)
VALUES ('dev@gestor-apafa.com', 'firebase-uid-admin', 'Admin', 'Sistema', 1);

-- NO tiene registro en usuario_colegio (acceso a todos los colegios)
```

**Reglas:**
1. El admin tiene acceso TOTAL a todos los endpoints (bypass de RolesGuard)
2. El admin NUNCA debe aparecer en listados de padres o directiva
3. Todas las queries de listado deben excluir: `WHERE role != 'admin'`

### Exception Filter Global

```typescript
// filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : 500;

    const errorResponse = {
      error: {
        code: exception instanceof HttpException 
          ? exception.name 
          : 'INTERNAL_ERROR',
        message: exception instanceof HttpException
          ? exception.message
          : 'Error interno del servidor',
        details: exception instanceof HttpException
          ? (exception.getResponse() as any)?.details || []
          : [],
      },
    };

    response.status(status).json(errorResponse);
  }
}
```

### Filtro de Errores MySQL

```typescript
// filters/mysql-exception.filter.ts
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

@Catch()
export class MySqlExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    // Error de duplicado (errno 1062)
    if (exception.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'El registro ya existe',
          details: [{ field: exception.sqlMessage, message: 'Duplicado' }],
        },
      });
    }

    // Error de foreign key (errno 1452)
    if (exception.code === 'ER_NO_REFERENCED_ROW_2') {
      return response.status(422).json({
        error: {
          code: 'FOREIGN_KEY_ERROR',
          message: 'El registro referenciado no existe',
        },
      });
    }

    // Error genérico de MySQL
    if (exception.code && exception.code.startsWith('ER_')) {
      return response.status(500).json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'Error de base de datos',
        },
      });
    }

    // Otros errores
    return response.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
}
```

### Registro en main.ts

```typescript
// main.ts
app.useGlobalFilters(
  new AllExceptionsFilter(),
  new MySqlExceptionFilter(),
);
```

---

## 5. Interceptors (Logging y Auditoría)

### Logging Interceptor

```typescript
// interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        console.log(`${method} ${url} ${duration}ms`);
      }),
    );
  }
}
```

### Audit Interceptor

```typescript
// interceptors/audit.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private db: DatabaseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, body, params } = request;
    const user = request.user;

    return next.handle().pipe(
      tap(async (response) => {
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
          const action = method === 'POST' ? 'CREATE' :
                         method === 'DELETE' ? 'DELETE' : 'UPDATE';
          
          await this.db.query(
            `INSERT INTO audit_logs (user_id, action, entity, entity_id, new_data, ip_address)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              user?.sub,
              action,
              this.extractEntity(request.url),
              response?.data?.id || parseInt(params.id),
              JSON.stringify(body),
              request.ip,
            ]
          );
        }
      }),
    );
  }

  private extractEntity(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[2] || 'unknown';
  }
}
```

---

## 6. Rate Limiting

### Configuración con @nestjs/throttler

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,    // 1 segundo
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,   // 10 segundos
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,   // 1 minuto
        limit: 100,
      },
    ]),
  ],
})
export class AppModule {}
```

### Throttler Guard por Ruta

```typescript
// auth/auth.controller.ts
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  
  @Post('login')
  @Throttle({ short: { ttl: 1000, limit: 1 } }) // 1 intento por segundo
  async login(@Headers('authorization') auth: string) { 
    // Token Firebase viene en el header, no en body
  }
}
```

---

## 7. Logging

### Configuración con NestJS Logger

```typescript
// logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLoggerService implements LoggerService {
  private logger = new Logger('APP');

  log(message: any, context?: string) {
    this.logger.log(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, context);
  }

  info(message: any, context?: string) {
    this.logger.log(message, context);
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, context);
  }
}
```

---

## 8. Variables de Entorno

### .env.example

```bash
# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gestor_apafa

# Firebase
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY="tu-private-key"
FIREBASE_CLIENT_EMAIL=tu-client-email

# JWT (token interno post-Firebase)
JWT_SECRET="tu-secreto-aqui"
JWT_EXPIRATION="24h"

# CORS
CORS_ORIGIN="http://localhost:4200"

# App
PORT=3000
```

---

## 9. Database Connection (mysql2)

### DatabaseModule

```typescript
// database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
```

### DatabaseService

```typescript
// database/database.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql, { Pool, PoolOptions } from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const options: PoolOptions = {
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    this.pool = mysql.createPool(options);

    // Verificar conexión
    try {
      const connection = await this.pool.getConnection();
      console.log('✅ MySQL connected successfully');
      connection.release();
    } catch (error) {
      console.error('❌ MySQL connection failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query(sql: string, params?: any[]) {
    return this.pool.execute(sql, params);
  }

  async getConnection() {
    return this.pool.getConnection();
  }
}
```

### Barrel Export

```typescript
// src/database/index.ts
export { DatabaseModule } from './database.module';
export { DatabaseService } from './database.service';
```

---

## 10. Helpers Compartidos

### Pagination Helper

```typescript
// src/shared/helpers/pagination.helper.ts
import { DatabaseService } from '../../database/database.service';

/**
 * Calcula offset y limit sanitizados para queries paginadas.
 * Limit máximo: 100 (protección contra abuso).
 */
export function calculatePagination(page: number, limit: number) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const offset = (safePage - 1) * safeLimit;
  return { offset, limit: safeLimit };
}

/**
 * Ejecuta una query paginada con COUNT total.
 * Retorna { data, total, page, limit, totalPages }.
 */
export async function executePaginatedQuery<T>(
  db: DatabaseService,
  baseQuery: string,
  countQuery: string,
  params: any[],
  page: number,
  limit: number,
) {
  const { offset, limit: safeLimit } = calculatePagination(page, limit);

  const [data] = await db.query<T[]>(
    `${baseQuery} LIMIT ? OFFSET ?`,
    [...params, safeLimit, offset],
  );

  const [countResult] = await db.query<{ total: number }[]>(
    countQuery,
    params,
  );

  const total = countResult[0]?.total ?? 0;

  return {
    data,
    total,
    page,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
}
```

---

## 11. Soft Delete

### Helper para Soft Delete

```typescript
// src/helpers/soft-delete.ts
import { DatabaseService } from '../database/database.service';

export class SoftDeleteHelper {
  static async softDelete(db: DatabaseService, table: string, id: number) {
    return db.query(
      `UPDATE ${table} SET deleted_at = NOW() WHERE id = ?`,
      [id]
    );
  }

  static async restore(db: DatabaseService, table: string, id: number) {
    return db.query(
      `UPDATE ${table} SET deleted_at = NULL WHERE id = ?`,
      [id]
    );
  }

  static async findActive(db: DatabaseService, table: string, where: string = '1=1', params: any[] = []) {
    return db.query(
      `SELECT * FROM ${table} WHERE deleted_at IS NULL AND ${where}`,
      params
    );
  }
}
```

> **Nota:** Los servicios actuales implementan soft delete directamente en SQL (no usan este helper). El helper está disponible para uso futuro si se necesita una abstracción más genérica.

### Uso en Services

```typescript
// src/modules/parents/parents.service.ts
async remove(id: number, colegioId: number) {
  // Verificar que el padre pertenece al colegio antes de eliminar
  const [padres] = await this.db.query(
    'SELECT id FROM padre WHERE id = ? AND colegio_id = ? AND deleted_at IS NULL',
    [id, colegioId],
  );

  if (!padres.length) {
    throw new NotFoundException('Padre no encontrado en este colegio');
  }

  return this.db.query(
    'UPDATE padre SET deleted_at = NOW() WHERE id = ? AND colegio_id = ?',
    [id, colegioId],
  );
}
```

> **Nota:** El soft delete se implementa directamente en cada servicio (no se usa `SoftDeleteHelper`). Cada servicio valida que el registro pertenezca al `colegio_id` del token antes de eliminar.

---

## Nota Importante

> Estos componentes se implementan **solo cuando el proyecto los necesita**.
> 
> - **Firebase Auth + Guard**: desde el inicio (requerido para autenticación)
> - **Role Guard**: desde el inicio (requerido para autorización)
> - **@ColegioId Decorator**: desde el inicio (requerido para multi-tenant)
> - **Validation Pipe**: desde el inicio (requerido para validación de DTOs)
> - **Exception Filter**: desde el inicio (manejo centralizado de errores)
> - **Logging**: desde el inicio (mínimo NestJS Logger)
> - **Pagination Helper**: desde el inicio (queries paginadas con límite 100)
> - **Rate Limiting**: cuando haya producción o abuse potencial
> - **Audit Interceptor**: cuando sea requerimiento del cliente
> - **Soft Delete**: desde el inicio (requerido por el sistema)
