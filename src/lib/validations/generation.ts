import { z } from "zod";

export const GenerationSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Source text must be at least 1000 characters")
    .max(10000, "Source text must not exceed 10000 characters"),
});

export type GenerationInput = z.infer<typeof GenerationSchema>;
