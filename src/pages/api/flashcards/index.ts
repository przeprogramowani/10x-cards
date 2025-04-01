import type { APIRoute } from "astro";
import { createErrorResponse } from "../../../lib/utils";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import { API_ERROR, type CreateFlashcardRequestDTO } from "../../../types";

interface SaveFlashcardsRequest {
  flashcards: CreateFlashcardRequestDTO[];
  generation_id?: string;
}

function validateFlashcards(
  flashcards: CreateFlashcardRequestDTO[]
): { isValid: true } | { isValid: false; error: API_ERROR } {
  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    return { isValid: false, error: API_ERROR.NO_FLASHCARDS_PROVIDED };
  }

  const invalidFlashcards = flashcards.filter(
    (card) => !card.front || !card.back || typeof card.front !== "string" || typeof card.back !== "string"
  );

  if (invalidFlashcards.length > 0) {
    return {
      isValid: false,
      error: API_ERROR.INVALID_FLASHCARD_FORMAT,
    };
  }

  return { isValid: true };
}

export const POST: APIRoute = async (context) => {
  try {
    const body: SaveFlashcardsRequest = await context.request.json();
    const { flashcards, generation_id } = body;

    const validation = validateFlashcards(flashcards);
    if (!validation.isValid) {
      return createErrorResponse(400, validation.error);
    }

    const { data: savedFlashcards, error: insertError } = await context.locals.supabase
      .from("flashcards")
      .insert(
        flashcards.map((card) => ({
          ...card,
          user_id: DEFAULT_USER_ID,
        }))
      )
      .select();

    if (insertError) {
      console.error("Failed to save flashcards:", insertError);
      return createErrorResponse(500, API_ERROR.INTERNAL_SERVER_ERROR, "Failed to save flashcards");
    }

    if (generation_id) {
      const { error: updateError } = await context.locals.supabase
        .from("generation_logs")
        .update({ flashcards_approved_count: flashcards.length })
        .eq("id", generation_id);

      if (updateError) {
        console.error("Failed to update generation log:", updateError);
      }
    }

    return new Response(JSON.stringify({ flashcards: savedFlashcards }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Save flashcards error:", error);
    return createErrorResponse(500, API_ERROR.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
  }
};
