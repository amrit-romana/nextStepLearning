import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL. Please add it to your .env.local file. ' +
    'Get it from https://supabase.com > Project Settings > API'
  )
}

if (!supabaseAnonKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please add it to your .env.local file. ' +
    'Get it from https://supabase.com > Project Settings > API'
  )
}

export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    )
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
