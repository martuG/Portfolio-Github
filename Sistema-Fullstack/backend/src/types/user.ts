export const ROLES = ["admin", "agent", "user"] as const;
export type Role = (typeof ROLES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at?: Date;
}
