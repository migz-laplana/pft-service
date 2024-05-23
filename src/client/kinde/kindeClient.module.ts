// kinde.module.ts
import { Module } from '@nestjs/common';
import { KindeClient } from './kindeClient.service';

@Module({
  imports: [],
  providers: [KindeClient],
  exports: [KindeClient],
})
export class KindeClientModule {}
