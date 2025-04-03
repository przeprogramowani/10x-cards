# Flashcards Generate View Implementation Plan

## 1. Overview
The Flashcards Generate view enables logged-in users to generate AI-based flashcard suggestions by pasting a block of text (1000-10000 characters). The view presents a text input, a generate button, a loading indicator during API calls, and a list of flashcard proposals with options to accept, edit, or reject each proposal. Users can save accepted proposals to persist them in the database.

## 2. View Routing
- **Path:** `/flashcards/generate`
- Integrate with the existing routing system and layout components.

## 3. Component Structure
- **FlashcardGenerationView:** Main container component for the view.
  - **TextArea Component:** Large input field for the user to paste their source text.
  - **Generate Button:** Triggers the API call to generate flashcard suggestions.
  - **Loading Indicator:** Displays progress to the user during API call processing.
  - **FlashcardProposals List Component:** Renders the list of flashcard proposals.
    - **FlashcardProposalItem Component:** Represents an individual flashcard proposal with:
      - Display of `question` and `answer`.
      - Action buttons: `Accept`, `Edit`, and `Reject`.
      - Inline editing UI when `Edit` is triggered.
  - **Save Button:** Allows the user to submit accepted (or edited) proposals via the POST `/api/flashcards` endpoint.

## 4. Types
- **DTOs (Imported):**
  - `InitGenerationDTO`: { source_text: string }
  - `GenerationResponseDTO`: { generation_id: string, number_of_suggestions: number, flashcardsProposals: FlashcardProposalResponseDTO[] }
  - `FlashcardProposalResponseDTO`: { question: string, answer: string, source: "ai-full" }
- **New/Extended Types:**
  - **FlashcardProposal:** Represents a proposal in the view, extended with local UI state:
    - `question: string`
    - `answer: string`
    - `source: "ai-full"`
    - `accepted?: boolean` – to track if the user accepted the proposal.
    - `edited?: boolean` – to indicate if the proposal has been modified.
    - `id?: string` – a temporary identifier for list management.

## 5. State Management
- **Local State Variables:**
  - `inputText: string` – holds the user's input.
  - `isGenerating: boolean` – indicates if a generation API call is in progress.
  - `error: string | null` – to store validation or API error messages.
  - `flashcardProposals: FlashcardProposal[]` – stores the list of generated proposals.
  - `generationId: string | null` – stores the generation identifier received from the API.
- **Custom Hook:**
  - `useFlashcardGeneration` – encapsulates API integration and state management logic, including:
    - Validation of `inputText`
    - Triggering the API call on button click
    - Managing `isGenerating`, updating `flashcardProposals`, and handling errors.

## 6. API Integration
- **POST /api/generations:**
  - Payload: `{ source_text: string }` (ensuring validation for 1000-10000 character range)
  - On success:
    - Update `flashcardProposals` with the `flashcardsProposals` from the response.
    - Store `generationId` and `number_of_suggestions` if needed.
  - On failure:
    - Set `error` state with a user-friendly message.
- **POST /api/flashcards:**
  - Triggered upon clicking the Save button with an array of accepted (or edited) flashcards.
  - Payload example:
    ```json
    [
      { "question": "string", "answer": "string", "source": "ai-full" or "ai-edited", "generation_id": generationId }
    ]
    ```
  - Handle validation errors returned by the API.

## 7. User Interactions
- **Text Input:**
  - User pastes the text and the component validates length (1000-10000 characters).
- **Generate Button:**
  - On click, validate input.
  - If valid, set loading state and call the generation API.
  - Clear existing proposals if a new generation is started.
- **Flashcard Proposal Actions:**
  - **Accept:** Marks the proposal for subsequent saving.
  - **Edit:** Opens inline editing fields for `question` and `answer`.
  - **Reject:** Removes the proposal from the list.
- **Save Button:**
  - Aggregates accepted (and edited) proposals.
  - Calls the flashcards creation API.
  - Provide success feedback or show error message if saving fails.

## 8. Error Handling
- **Input Validation:**
  - Ensure text meets the character count before enabling generation.
  - Show immediate validation errors next to the text field.
- **API Errors:**
  - Display a global error message if the generation API responds with errors (400 or 500).
  - For saving flashcards, display specific error details for any validation issues.
- **Fallbacks:**
  - Provide user feedback and allow retrying of operations.

## 9. Performance Considerations
- **Debounce Input:** Consider debouncing if additional validations or API calls are integrated in future enhancements.
- **Minimize Re-renders:** Optimize the proposal list rendering using keys and memoization to avoid unnecessary re-renders.
- **Lazy Loading:** If the list of generated proposals becomes large, consider implementing lazy loading.

## 10. Implementation Steps
1. **Routing:** Create a new route `/flashcards/generate` in the routing configuration.
2. **Initial Layout:** Use existing layout components to wrap the `FlashcardGenerationView`.
3. **Create Components:**
   - Develop `FlashcardGenerationView` with a text area, generate button, loading indicator, and a proposals list.
   - Create `FlashcardProposalItem` component for each flashcard proposal with Accept, Edit, and Reject actions.
4. **State & Hook:** Implement `useFlashcardGeneration` hook to manage all state and API integration logic.
5. **API Integration:** Implement API calls for POST `/api/generations` and handle responses as per the endpoint description.
6. **Inline Editing:** Add inline editing capability on each flashcard proposal.
7. **Save Functionality:** Implement a Save button that aggregates accepted proposals and calls POST `/api/flashcards`.
8. **Error Handling:** Add appropriate UI error messages for validation and API errors.
9. **Styling:** Style components using Tailwind CSS and Shadcn/ui components for consistency.
10. **Testing:** Test the complete flow including edge cases (e.g., invalid input, API errors) and ensure that state resets correctly on new generation requests.
