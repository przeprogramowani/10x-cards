import type { Tables } from "./db/database.types";

export enum API_ERROR {
  INPUT_TEXT_TOO_SHORT = "input_text_too_short",
  INPUT_TEXT_TOO_LONG = "input_text_too_long",
  INVALID_FLASHCARD_FORMAT = "invalid_flashcard_format",
  INTERNAL_SERVER_ERROR = "internal_server_error",
  NO_FLASHCARDS_PROVIDED = "no_flashcards_provided",
}

export type Flashcard = Tables<"flashcards">;
export type GenerationLog = Tables<"generation_logs">;

export type CreateFlashcardRequestDTO = Pick<Flashcard, "front" | "back">;
export type GenerateFlashcardsRequestDTO = Pick<Flashcard, "front" | "back">;
