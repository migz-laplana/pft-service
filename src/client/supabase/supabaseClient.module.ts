import { Module } from '@nestjs/common';
import { SupabaseClientService } from './supabaseClient.service';

@Module({
  providers: [SupabaseClientService],
  exports: [SupabaseClientService],
})
export class SupabaseClientModule {}
