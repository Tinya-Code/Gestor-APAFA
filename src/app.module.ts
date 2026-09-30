import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ParentsModule } from './modules/parents/parents.module';
import { StudentsModule } from './modules/students/students.module';
import { AdminModule } from './modules/admin/admin.module';
import { DirectivaModule } from './modules/directiva/directiva.module';
import { AssembliesModule } from './modules/assemblies/assemblies.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    ParentsModule,
    StudentsModule,
    DirectivaModule,
    AssembliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
