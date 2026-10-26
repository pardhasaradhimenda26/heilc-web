/** Row shape of public.profiles (supabase/migrations/0001). */
export interface Profile {
  id: string;
  full_name: string;
  persona: "startup" | "enterprise" | "student";
  segment: string | null;
  interests: string[];
  company: string | null;
  role: string | null;
  stage: string | null;
  timeline: string | null;
  goal: string | null;
  phone: string | null;
  marketing_opt_in: boolean;
  nominee_name: string | null;
  nominee_contact: string | null;
  notice_version: string;
  notice_language: string;
  consented_at: string;
  created_at: string;
  updated_at?: string;
  last_active_at: string;
}
