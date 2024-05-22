import { Injectable, OnModuleInit } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from 'src/types/supabase.types';

@Injectable()
export class SupabaseClientService implements OnModuleInit {
  private supabase: SupabaseClient<Database>;

  onModuleInit() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient<Database> {
    return this.supabase;
  }
}
