import { z } from "zod";

export const USER_ROLES = [
  "startup",
  "mentor",
  "partner",
  "admin",
  "ecosystem-owner",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  startup: "Startup Founder",
  mentor: "Mentor",
  partner: "Partner / Service Provider",
  admin: "Programme Administrator",
  "ecosystem-owner": "Ecosystem Owner",
};

export const userProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable().optional(),
  photoURL: z.string().nullable().optional(),
  role: z.enum(USER_ROLES).optional(),
  organisationId: z.string().optional(),
  organisationName: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
  onboardedAt: z.union([z.string(), z.date()]).optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export function dashboardPathForRole(role: UserRole | undefined): string {
  switch (role) {
    case "startup":
      return "/founder";
    case "mentor":
      return "/mentor";
    case "admin":
    case "ecosystem-owner":
      return "/admin";
    case "partner":
      return "/partner";
    default:
      return "/role";
  }
}
