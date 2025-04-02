import { z } from "zod";
import type { APIRoute } from "astro";
import { GenerationService } from "../../services/GenerationService";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

// Validation schema for the request body
const GenerationRequestSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Text must be at least 1000 characters long")
    .max(10000, "Text cannot exceed 10000 characters"),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Get supabase client from locals (as per backend.mdc guidelines)
    const supabase = locals.supabase;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = GenerationRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation error",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { source_text } = validationResult.data;
    const userId = DEFAULT_USER_ID;

    // Generate flashcards
    const generationService = new GenerationService(supabase);
    const result = await generationService.generateFlashcards(source_text, userId);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
