import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthService } from './jwt.service';
import { parseExpirationToSeconds } from '../../shared/helpers/expiration.helper';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseExpirationToSeconds(
            configService.get<string>('JWT_EXPIRATION', '86400'),
          ),
        },
      }),
    }),
  ],
  providers: [JwtAuthService],
  exports: [JwtModule, JwtAuthService],
})
export class AuthJwtModule {}
