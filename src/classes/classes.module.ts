import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { KindeClientModule } from 'src/client/kinde/kindeClient.module';
import { SupabaseClientModule } from 'src/client/supabase/supabaseClient.module';

@Module({
  imports: [KindeClientModule, SupabaseClientModule],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
