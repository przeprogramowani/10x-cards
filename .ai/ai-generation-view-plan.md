# Implementation Plan for AI Flashcard Generation View

## 1. Overview
This view allows a logged-in user to paste a source text (between 1000 and 10000 characters) and generate flashcard proposals using an AI model. The proposals are then displayed for review, where the user can accept, edit, or reject each suggestion before saving the final flashcards to the database.

## 2. Component Structure
- **AIGenerationView** (Parent component)
  - **SourceTextInput**: A large textarea where the user pastes the source text.
  - **GenerateButton**: A button to initiate the AI generation process.
  - **LoadingIndicator**: An indicator (spinner or progress bar) shown during API calls.
  - **FlashcardsList**: A container component that displays the list of generated flashcard proposals.
    - **FlashcardItem**: Represents an individual flashcard proposal with buttons for Accept, Edit, and Reject.
  - **SaveFlashcardsButton**: A button to save all accepted (and possibly edited) flashcards to the backend.
  - **ErrorMessage**: A component to display validation or API error messages.

## 3. Types
- **GenerationResponseDTO**: Represents the API response from POST /api/generations. It includes:
  - generation_id: string or number
  - number_of_suggestions: number
  - flashcardsProposals: Array of objects with properties: question, answer, source (always "ai-full")

- **FlashcardProposalViewDTO**: Extends the API proposal with additional client-side flags if necessary (e.g., accepted, edited).

- **FormState**: For managing the source text input, including validations for text length.

## 4. State Management
- **sourceText (string)**: Holds the current text from the textarea.
- **isLoading (boolean)**: Indicates whether an API call is in progress.
- **flashcards (Array&lt;FlashcardProposalViewDTO&gt;)**: Stores the list of flashcard proposals returned from the API, enhanced with client-side flags such as accepted, edited, or rejected.
- **errorMessage (string | null)**: Stores error messages to display to the user.
- Optionally, a custom hook (e.g., useAIGeneration) can be created to encapsulate the API call logic and state management for generating flashcards.

## 5. API Integration
- **POST /api/generations**:
  - Triggered when the user clicks the Generate button.
  - Request payload: { source_text: string }
  - On success, update the `flashcards` state with the proposals from the response.
  - On error (400 or 500), capture and display the error in `errorMessage`.

- **POST /api/flashcards**:
  - Triggered when the user clicks the SaveFlashcardsButton after review.
  - Request payload: Array of flashcards including question, answer, source (either "ai-full" or "ai-edited"), and generation_id.
  - Provide user feedback upon successful save or display errors if the submission fails.

## 6. User Interactions
- **Text Input Validation**: The textarea should enforce a minimum of 1000 characters and a maximum of 10000 characters. Provide inline feedback if the limit isn't met.
- **Generate Process**:
  - On clicking the Generate button, the view validates the text length and, if valid, displays the loading indicator and calls the API.
  - Once the proposals are returned, hide the loader and show the FlashcardsList.
- **Proposal Management**:
  - Each FlashcardItem displays generated question and answer.
  - Users can accept a proposal (marking it for saving), edit the question/answer inline, or reject (remove) it from the list.
- **Saving Flashcards**: Clicking the SaveFlashcardsButton sends the list of accepted (and possibly edited) flashcards to the backend.

## 7. Error Handling
- **Validation Errors**: If the text input does not meet the character limits, display an appropriate message and prevent API calls.
- **API Errors**: If the POST /api/generations returns a 400 or 500 error, display a user-friendly error message in the ErrorMessage component.
- **Network Issues**: Wrap API calls in try/catch blocks to handle unexpected errors and provide a retry mechanism if necessary.
- **Save Errors**: If saving flashcards fails, show error feedback and allow the user to attempt saving again.

## 8. Performance Considerations
- **Debounce Input**: Consider debouncing validation on the textarea to optimize performance and avoid unnecessary renders.
- **Memoization**: Use React.memo for FlashcardItem components if the list is large to prevent unnecessary re-renders.
- **Async Handling**: Ensure that async API calls are cancelled if the component unmounts to avoid memory leaks or state updates on unmounted components.
- **Efficient Re-renders**: Update only the affected state portions during user interactions to ensure a smooth UI experience.