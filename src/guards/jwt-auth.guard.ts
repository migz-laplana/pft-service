import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PassportStrategyName } from 'src/types/auth.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard(PassportStrategyName.JWT) {}
