import { createClient } from '@supabase/supabase-js'
import { supabaseKey, supabaseUrl } from './supabaseConfig'

export const client = supabaseUrl && supabaseKey?.startsWith('sb_publishable_')
  ? createClient(supabaseUrl, supabaseKey, { auth: { detectSessionInUrl: false } })
  : null
