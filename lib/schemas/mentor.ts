import { z } from "zod";

export const mentorProfileSchema = z.object({
  mentorName: z.string().min(1),
  expertiseAreas: z.array(z.string()).min(1),
  sectorFocus: z.array(z.string()).min(1),
  country: z.string().min(1),
  organisation: z.string().optional(),
  startupStageFit: z.array(z.string()).optional(),
  availability: z.string().optional(),
  credentials: z.string().optional(),
  bio: z.string().min(20),
  linkedinUrl: z.string().optional(),
});

export type MentorProfile = z.infer<typeof mentorProfileSchema>;
