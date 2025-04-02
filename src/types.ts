import type { Database } from "./db/database.types";

export type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];
export type Generation = Database["public"]["Tables"]["generations"]["Row"];
export type GenerationErrorLog = Database["public"]["Tables"]["generation_error_logs"]["Row"];
