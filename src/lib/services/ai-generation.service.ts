import type { Database } from "../../db/database.types";
import type { Flashcard } from "../../types";
import { supabaseClient, type SupabaseClient } from "../../db/supabase.client";

export type FlashcardSuggestion = Pick<Flashcard, "question" | "answer"> & { source: "ai-full" };

export interface GenerationResult {
  generation_id: number;
  user_id: string;
  created_at: string;
  number_of_suggestions: number;
  flashcards_suggestions: FlashcardSuggestion[];
}

// TODO: Replace with actual AI service integration
export async function generateFlashcards(
  sourceText: string,
  supabaseClient: SupabaseClient
): Promise<FlashcardSuggestion[]> {
  // Mock implementation for now
  const mockSuggestions = [
    {
      question: "What is the capital of France?",
      answer: "Paris",
      source: "ai-full" as const,
    },
  ];

  // In real implementation, this would call the AI service
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
  return mockSuggestions;
}

export async function createGeneration(
  userId: string,
  sourceText: string,
  suggestions: FlashcardSuggestion[],
  supabaseClient: SupabaseClient
): Promise<GenerationResult> {
  const generationData: Database["public"]["Tables"]["generations"]["Insert"] = {
    user_id: userId,
    source_text_hash: Buffer.from(sourceText).toString("base64"),
    source_text_length: sourceText.length,
    generation_time: 1000, // Mock time for now
    model_type: "gpt-4",
    number_of_suggestions: suggestions.length,
  };

  const { data: generation, error } = await supabaseClient.from("generations").insert(generationData).select().single();

  if (error) {
    throw new Error(`Failed to create generation: ${error.message}`);
  }

  if (!generation) {
    throw new Error("Failed to create generation: No data returned");
  }

  return {
    generation_id: generation.id,
    user_id: generation.user_id,
    created_at: generation.created_at,
    number_of_suggestions: generation.number_of_suggestions,
    flashcards_suggestions: suggestions,
  };
}
