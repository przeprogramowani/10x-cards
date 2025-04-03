import type { Database } from "./db/database.types";

export type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];
export type Generation = Database["public"]["Tables"]["generations"]["Row"];
export type GenerationErrorLog = Database["public"]["Tables"]["generation_error_logs"]["Row"];

// DTO type definitions for API endpoints

// Flashcard DTO used for GET /api/flashcards and GET /api/flashcards/:id
export type FlashcardDTO = Flashcard;

export type Source = "manual" | "ai-full" | "ai-edited";

export type AISource = Extract<Source, "ai-full" | "ai-edited">;

// DTO for creating a flashcard via POST /api/flashcards
export type CreateFlashcardDTO = Pick<Flashcard, "question" | "answer" | "generation_id"> & {
  source: Source;
};

// DTO for updating a flashcard via PUT /api/flashcards/:id
export type UpdateFlashcardDTO = Pick<Flashcard, "question" | "answer">;

// DTO for flashcard proposals returned in generation responses
export interface FlashcardProposalResponseDTO {
  question: string;
  answer: string;
  source: "ai-full";
}

export type FlashcardProposalViewDTO = Pick<Flashcard, "question" | "answer"> & {
  id: string;
  source: AISource;
};
// DTO for creating a generation via POST /api/generations
export interface InitGenerationDTO {
  source_text: string;
}

// DTO for the response of POST /api/generations
export interface GenerationResponseDTO {
  generation_id: string;
  number_of_suggestions: number;
  flashcardsProposals: FlashcardProposalResponseDTO[];
}

// DTO for listing generations (GET /api/generations)
export type GenerationListDTO = Generation[];

// DTO for detailed generation info (GET /api/generations/:id)
export type GenerationDetailDTO = Generation;

export type CreateGeneration = Omit<Generation, "id" | "created_at">;

// DTO for generation error logs (used in GET /api/generation-logs and GET /api/generation-logs/:id)
export type GenerationErrorLogDTO = Pick<
  GenerationErrorLog,
  "id" | "user_id" | "created_at" | "model_type" | "error_code" | "error_message"
>;

// Generic paginated response DTO used by multiple GET endpoints
export interface PaginatedResponseDTO<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

// Type for inserting generation error logs
export type CreateGenerationErrorLog = Omit<GenerationErrorLog, "id" | "created_at"> & {
  source_text_hash: string;
  source_text_length: number;
  generation_time: number;
};
