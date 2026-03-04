export type CheckIn = {
  id: string;
  check_in_date: string;
  log_type: "movement" | "social" | "sleep";
  notes?: string;
  energy_level?: number;
  sleep_quality?: "good" | "okay" | "bad";
  social_interaction?: "no_interaction" | "text" | "call" | "in_person";
};
