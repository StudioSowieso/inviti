// Publieke Supabase-gegevens (veilig om in de browser te gebruiken).
// Kunnen per omgeving overschreven worden via Vercel environment variables.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://fquskmhckspkfguzjpkn.supabase.co";

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_s75U8x-al2-xQe_Aj80crg_b4ihhSNF";
