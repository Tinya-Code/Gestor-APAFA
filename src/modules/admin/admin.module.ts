import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ColegiosService } from './colegios.service';
import { UsuariosService } from './usuarios.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [ColegiosService, UsuariosService],
})
export class AdminModule {}
