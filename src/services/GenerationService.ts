import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";
import type { GenerationInsert, GenerationErrorLogInsert } from "../types";

export interface FlashcardProposal {
  question: string;
  answer: string;
  source: "ai-full";
}

export interface GenerationResult {
  generation_id: number;
  number_of_suggestions: number;
  flashcardsProposals: FlashcardProposal[];
}

export class GenerationService {
  constructor(private supabase: SupabaseClient<Database>) {}

  private generateMockFlashcards(text: string): FlashcardProposal[] {
    // Mock implementation that creates 3 flashcards based on text length
    return [
      {
        question: `Sample question 1 (text length: ${text.length})`,
        answer: "Sample answer 1",
        source: "ai-full",
      },
      {
        question: "Sample question 2",
        answer: "Sample answer 2",
        source: "ai-full",
      },
      {
        question: "Sample question 3",
        answer: "Sample answer 3",
        source: "ai-full",
      },
    ];
  }

  private calculateTextHash(text: string): string {
    return crypto.createHash("md5").update(text).digest("hex");
  }

  private async saveGeneration(data: GenerationInsert): Promise<number> {
    const { data: generation, error } = await this.supabase.from("generations").insert(data).select("id").single();

    if (error) {
      throw new Error(`Failed to save generation: ${error.message}`);
    }

    return generation.id;
  }

  async logError(error: Error, userId: string, sourceText: string): Promise<void> {
    const errorLog: GenerationErrorLogInsert = {
      user_id: userId,
      error_message: error.message,
      error_type: error.name,
      source_text_hash: this.calculateTextHash(sourceText),
      source_text_length: sourceText.length,
      error_code: "GENERATION_FAILED",
      generation_time: 0,
      model_type: "mock-gpt",
    };

    const { error: dbError } = await this.supabase.from("generation_error_logs").insert(errorLog);

    if (dbError) {
      console.error("Failed to log generation error:", dbError);
    }
  }

  async generateFlashcards(sourceText: string, userId: string): Promise<GenerationResult> {
    const startTime = performance.now();

    try {
      // Generate mock flashcards
      const flashcards = this.generateMockFlashcards(sourceText);

      const endTime = performance.now();
      const generationTime = Math.round(endTime - startTime);

      // Prepare generation data
      const generationData: GenerationInsert = {
        user_id: userId,
        model_type: "mock-gpt",
        number_of_suggestions: flashcards.length,
        source_text_hash: this.calculateTextHash(sourceText),
        source_text_length: sourceText.length,
        generation_time: generationTime,
        accepted_flashcards_edited: 0,
        accepted_flashcards_unedited: 0,
      };

      const generationId = await this.saveGeneration(generationData);

      return {
        generation_id: generationId,
        number_of_suggestions: flashcards.length,
        flashcardsProposals: flashcards,
      };
    } catch (error) {
      // Log error and rethrow
      await this.logError(error as Error, userId, sourceText);
      throw error;
    }
  }
}
