import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import { GenerationSchema } from "../../lib/validations/generation";
import { generateFlashcards, createGeneration } from "../../lib/services/ai-generation.service";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = GenerationSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate flashcards using AI
    const suggestions = await generateFlashcards(result.data.source_text, locals.supabase);

    // Create generation record
    const generationResult = await createGeneration(
      DEFAULT_USER_ID,
      result.data.source_text,
      suggestions,
      locals.supabase
    );

    return new Response(JSON.stringify(generationResult), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing generation request:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
