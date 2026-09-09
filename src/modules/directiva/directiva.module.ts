import { Module } from '@nestjs/common';
import { DirectivaController } from './directiva.controller';
import { DirectivaService } from './directiva.service';
import { ReemplazosController } from './reemplazos.controller';
import { ReemplazosService } from './reemplazos.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DirectivaController, ReemplazosController],
  providers: [DirectivaService, ReemplazosService],
  exports: [ReemplazosService],
})
export class DirectivaModule {}
