import { Module } from '@nestjs/common';
import { FitnessTestResultService } from './fitness-test-result.service';
import { FitnessTestResultController } from './fitness-test-result.controller';
import { SupabaseClientModule } from 'src/client/supabase/supabaseClient.module';

@Module({
  imports: [SupabaseClientModule],
  controllers: [FitnessTestResultController],
  providers: [FitnessTestResultService],
})
export class FitnessTestResultModule {}
