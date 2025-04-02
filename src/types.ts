import type { Database } from "./db/database.types";

export type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];
export type Generation = Database["public"]["Tables"]["generations"]["Row"];
export type GenerationErrorLog = Database["public"]["Tables"]["generation_error_logs"]["Row"];

export interface FlashcardInsert extends Omit<Flashcard, "id" | "created_at"> {
  generation_id: number;
  question: string;
  answer: string;
  source: "ai-full";
}

export interface GenerationInsert extends Omit<Generation, "id" | "created_at"> {
  user_id: string;
  model_type: string;
  number_of_suggestions: number;
  source_text_hash: string;
  source_text_length: number;
  generation_time: number;
}

export interface GenerationErrorLogInsert extends Omit<GenerationErrorLog, "id" | "created_at"> {
  user_id: string;
  error_message: string;
  error_type: string;
  source_text_hash: string;
  source_text_length: number;
}
