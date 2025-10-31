// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Obtenemos las variables de entorno que pusimos en .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Creamos y exportamos el cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)