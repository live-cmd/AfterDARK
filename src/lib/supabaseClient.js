import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://psxvjiuufwwcqrkdpueh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_M6rVL6iN53U8DyZkCi9oMQ_Mm4FjfLm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
