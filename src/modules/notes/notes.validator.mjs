import { z } from "zod";
import { EXPIRY_CHOICES_ARR } from "../../config/enum.mjs";

export const createNoteSchema = z.object({
  title: z.string().trim().max(150).optional(),
  content: z.string().trim().min(1, "Note content cannot be empty"),
  expiryChoice: z.enum(EXPIRY_CHOICES_ARR).optional().default("never"),
});
