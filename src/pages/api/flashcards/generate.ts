import type { APIRoute } from "astro";
import { createErrorResponse } from "../../../lib/utils";
import { API_ERROR, type GenerateFlashcardsRequestDTO } from "../../../types";

interface GenerateRequest {
  inputText: string;
}

interface GenerateResponse {
  flashcards: GenerateFlashcardsRequestDTO[];
  generation_id: string | null;
}

// Constants
const MIN_TEXT_LENGTH = 1000;
const MAX_TEXT_LENGTH = 10000;

export const POST: APIRoute = async (context) => {
  try {
    // Get the user ID from the session
    const session = await context.locals.supabase.auth.getSession();
    if (!session.data.session?.user) {
      return createErrorResponse(401, API_ERROR.UNAUTHORIZED, "User must be authenticated");
    }
    const userId = session.data.session.user.id;

    // Parse and validate request body
    const body: GenerateRequest = await context.request.json();
    const { inputText: inputText } = body;

    if (!inputText || inputText.length < MIN_TEXT_LENGTH) {
      return createErrorResponse(
        400,
        API_ERROR.INPUT_TEXT_TOO_SHORT,
        "Input text must be at least " + MIN_TEXT_LENGTH + " characters"
      );
    }

    if (inputText.length > MAX_TEXT_LENGTH) {
      return createErrorResponse(
        400,
        API_ERROR.INPUT_TEXT_TOO_LONG,
        "Input text must not exceed " + MAX_TEXT_LENGTH + " characters"
      );
    }

    const startTime = Date.now();

    // TODO: Implement AI service integration
    // For now, return mock data
    const mockFlashcards: GenerateFlashcardsRequestDTO[] = [
      {
        front: "What is the capital of France?",
        back: "Paris",
      },
      {
        front: "What is the largest planet in our solar system?",
        back: "Jupiter",
      },
    ];

    // Log generation attempt using regular client
    const { data: generationLog, error: logError } = await context.locals.supabase
      .from("generation_logs")
      .insert({
        user_id: userId,
        input_length: inputText.length,
        flashcards_count: mockFlashcards.length,
        status: "success",
        response_time: Date.now() - startTime,
      })
      .select();

    if (logError) {
      console.error("Failed to log generation:", logError);
      const response: GenerateResponse = {
        flashcards: mockFlashcards,
        generation_id: null,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure generationLog exists and has at least one row
    if (!generationLog || generationLog.length === 0) {
      console.error("Generation log was not created properly");
      return createErrorResponse(500, API_ERROR.INTERNAL_SERVER_ERROR, "Failed to create generation log");
    }

    const response: GenerateResponse = {
      flashcards: mockFlashcards,
      generation_id: generationLog[0].id,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generation error:", error);
    return createErrorResponse(500, API_ERROR.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
  }
};
