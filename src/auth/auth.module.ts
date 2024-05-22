import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth.strategy';
import { PassportStrategyName } from 'src/types/auth.types';
import { KindeClientModule } from 'src/client/kinde/kindeClient.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: PassportStrategyName.JWT }),
    KindeClientModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
