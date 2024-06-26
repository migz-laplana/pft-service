import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { ClassesModule } from './classes/classes.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FitnessTestResultModule } from './fitness-test-result/fitness-test-result.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ClassesModule, FitnessTestResultModule],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
