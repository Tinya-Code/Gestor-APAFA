# A9 — Infraestructura Complementaria

### Pregunta

> ¿Qué necesita el sistema para ser robusto?

---

Aquí aparecen únicamente cuando son necesarios. No forman parte del código base; se incorporan cuando el proyecto los necesita.

Stack: **NestJS** (backend) + **Angular** (frontend) — Este documento es solo para el backend.

---

## 1. Seguridad

### Firebase Admin SDK

```typescript
// config/firebase.config.ts
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

export default admin;
```

### Validación de Token Firebase

```typescript
// auth/firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from '../config/firebase.config';

@Injectable()
export class FirebaseService {
  async verifyToken(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
```

### JWT Interno (post-validación Firebase)

```typescript
// auth/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async generateInternalToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async verifyInternalToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
```

---

## 2. Guards

### Firebase Auth Guard

```typescript
// auth/guards/firebase-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const decodedToken = await this.firebaseService.verifyToken(token);
    request.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      // Se enriquece con datos de la DB después
    };
    
    return true;
  }
}
```

### Role Guard

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    return requiredRoles.includes(user.role);
  }
}
```

### Roles Decorator

```typescript
// auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

### Uso en Controllers

```typescript
// parents/parents.controller.ts
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller('parents')
export class ParentsController {
  
  @Get()
  @Roles('admin', 'president', 'vice_president', 'treasurer')
  findAll() { ... }

  @Post()
  @Roles('admin', 'president', 'vice_president')
  create(@Body() dto: CreateParentDto) { ... }

  @Put(':id')
  @Roles('admin', 'president', 'vice_president')
  update(@Param('id') id: number, @Body() dto: UpdateParentDto) { ... }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: number) { ... }
}
```

---

## 3. Pipes (Validación)

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
// parents/dto/create-parent.dto.ts
import { IsString, IsEmail, Matches, MinLength } from 'class-validator';

export class CreateParentDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  surname: string;

  @IsString()
  @Matches(/^\d{7,8}$/)
  dni: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;
}
```

---

## 4. Filters (Manejo de Errores)

### Exception Filter Global

```typescript
// filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

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

    // Log del error
    this.logger.error({
      method: request.method,
      path: request.path,
      status,
      error: exception instanceof Error ? exception.message : 'Unknown',
      stack: exception instanceof Error ? exception.stack : undefined,
      user: request.user?.sub,
    });

    response.status(status).json(errorResponse);
  }
}
```

### Filtro Específico de Prisma

```typescript
// filters/prisma-exception.filter.ts
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    switch (exception.code) {
      case 'P2002':
        return response.status(409).json({
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'El registro ya existe',
            details: [{ field: exception.meta?.target, message: 'Duplicado' }],
          },
        });
      case 'P2025':
        return response.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Registro no encontrado',
          },
        });
      default:
        return response.status(500).json({
          error: {
            code: 'DATABASE_ERROR',
            message: 'Error de base de datos',
          },
        });
    }
  }
}
```

### Registro en main.ts

```typescript
// main.ts
app.useGlobalFilters(
  new AllExceptionsFilter(logger),
  new PrismaExceptionFilter(),
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
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.info({
          method,
          path: url,
          duration: `${duration}ms`,
          user: request.user?.sub,
        });
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
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, body, params } = request;
    const user = request.user;

    return next.handle().pipe(
      tap(async (response) => {
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
          const action = method === 'POST' ? 'CREATE' :
                         method === 'DELETE' ? 'DELETE' : 'UPDATE';
          
          await this.prisma.auditLog.create({
            data: {
              user_id: user?.sub,
              action,
              entity: this.extractEntity(request.url),
              entity_id: response?.data?.id || parseInt(params.id),
              new_data: body,
              ip_address: request.ip,
            },
          });
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
  async login(@Body() dto: LoginDto) { ... }
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
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/gestor_apafa"

# Firebase
FIREBASE_PROJECT_ID="tu-project-id"
FIREBASE_PRIVATE_KEY="tu-private-key"
FIREBASE_CLIENT_EMAIL="tu-client-email"

# JWT (token interno post-Firebase)
JWT_SECRET="tu-secreto-aqui"
JWT_EXPIRATION="24h"

# CORS
CORS_ORIGIN="http://localhost:4200"

# Rate Limit
THROTTLE_TTL=1000
THROTTLE_LIMIT=10
```

---

## 9. Soft Delete

### Prisma Middleware

```typescript
// prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$use(async (params, next) => {
      // Auto-filtrar registros eliminados lógicamente
      if (params.action === 'findMany') {
        params.args.where = {
          ...params.args.where,
          deleted_at: null,
        };
      }
      return next(params);
    });
  }
}
```

### Soft Delete Helper

```typescript
// prisma/helpers/soft-delete.ts
export class SoftDeleteHelper {
  static async softDelete(prisma: any, model: string, id: number) {
    return prisma[model].update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  static async restore(prisma: any, model: string, id: number) {
    return prisma[model].update({
      where: { id },
      data: { deleted_at: null },
    });
  }
}
```

---

## Nota Importante

> Estos componentes se implementan **solo cuando el proyecto los necesita**.
> 
> - **Firebase Auth + Guard**: desde el inicio (requerido para autenticación)
> - **Role Guard**: desde el inicio (requerido para autorización)
> - **Validation Pipe**: desde el inicio (requerido para validación de DTOs)
> - **Exception Filter**: desde el inicio (manejo centralizado de errores)
> - **Logging**: desde el inicio (mínimo NestJS Logger)
> - **Rate Limiting**: cuando haya producción o abuse potencial
> - **Audit Interceptor**: cuando sea requerimiento del cliente
> - **Soft Delete**: desde el inicio (requerido por el sistema)
