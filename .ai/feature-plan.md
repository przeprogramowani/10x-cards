# Feature Implementation Plan for AI Flashcard Generation

## 1. Database Schema

### Tables

**flashcards**
- id: UUID, primary key.
- user_id: UUID, foreign key referencing the users table (initially a hardcoded single user).
- front: TEXT, content for the front of the flashcard.
- back: TEXT, content for the back of the flashcard.
- created_at: TIMESTAMP, auto-generated
- updated_at: TIMESTAMP, auto-updated

**generation_logs**
- id: UUID, primary key.
- input_length: INTEGER, the length of the provided input text.
- flashcards_count: INTEGER, the number of flashcards generated.
- flashcards_approved_count: INTEGER (nullable), the number of flashcards approved by the user.
- status: ENUM, status of the generation process (e.g., 'success' or 'failure').
- response_time: INTEGER, time taken by the AI service to respond (in milliseconds).
- error_message: TEXT (nullable), details of any errors during generation.
- created_at: TIMESTAMP, timestamp when the record was created.

**auth.users** (provided by Supabase Auth)
- id: UUID, primary key.
- email: TEXT, email address of the user.
- created_at: TIMESTAMP, auto-generated.
- updated_at: TIMESTAMP, auto-updated.

### Relationships

- Each flashcard is associated with a user via user_id.
- Generation logs are maintained independently as a debugging and monitoring tool, without formal database relationships to other tables.

## 2. REST API Implementation

### Endpoints

#### POST /api/flashcards/generate
- **Purpose:** Accepts input text, validates it, and uses an AI service to synchronously generate flashcards.
- **Request:**
  - Content-Type: application/json
  - Body: { "input_text": "string" }
- **Validations:**
  - Input text length must be between 1000 and 10000 characters. If the input text does not meet these requirements, the system will respond with an HTTP 400 error using one of the following error codes:
    - "text_too_short" for texts shorter than 1000 characters,
    - "text_too_long" for texts longer than 10000 characters,
    - "not_allowed" for disallowed content.
- **Processing:**
  - Call the AI service synchronously to generate an array of flashcards with "front" and "back" fields. The flashcards will be generated in a "pending" state and kept only in memory.
  - Enforce a timeout of 3 minutes for the generation process. If the generation exceeds 3 minutes, the system should return a timeout error.
  - Log basic generation details (status, input_length, flashcards_count, response_time, error_message) into the generation_logs table.
- **Response:**
  - { "flashcards": [ { "front": "string", "back": "string" }, ... ], generation_id: "uuid", "created_at": "timestamp" }

#### POST /api/flashcards
- **Purpose:** Saves an approved flashcard (or multiple flashcards) to the database after user edits.
- **Request:**
  - Content-Type: application/json
  - Body: { "flashcards": [ { "front": "string", "back": "string" }, ... ] }
- **Processing:**
  - Validate the flashcards are in the correct format.
  - Save only the approved flashcards to the flashcards table.
  - Update the generation_logs table with the basic count of approved flashcards.
- **Response:**
  - The saved flashcard records including their IDs and timestamps.

### Security

- All endpoints under /api must be secured using Supabase JWT authentication.
- In the initial version, implement a simplified authentication with a hardcoded user until full authentication is integrated.

## 3. Work Plan

### Phase 1: Database Design and Setup
- Write migration scripts to create the tables in PostgreSQL (via Supabase).
- Validate table constraints and relationships.

### Phase 2: REST API Development
- Set up API routes under /api in the project structure.
- Implement POST /api/flashcards/generate:
  - Validate the input text length (1000 to 10000 characters).
  - For now mock the AI service response with a static JSON response.
  - Log generation details into the generation_logs table.
  - Return the generated flashcards as a preview.
- Implement POST /api/flashcards for saving approved flashcards.

### Phase 3: Security Integration
- Integrate Supabase JWT middleware to secure the API endpoints.
- Use a hardcoded user for authentication in the prototype phase.

### Phase 4: Testing and Documentation
- Document the API endpoints and database schema.
- Ensure robust error handling and validation (e.g., handling invalid input).

## 4. Considerations and Trade-offs

- The synchronous AI generation approach may affect response times under heavy load; future iterations might consider an asynchronous approach.
- Hardcoded authentication is a temporary measure; a full authentication system using Supabase auth should be implemented in subsequent phases.
- Generation logs are maintained as a basic diagnostic tool without formal database relationships, prioritizing simplicity over detailed analytics.
- Pending flashcards are kept in memory only, reducing database complexity while maintaining a clean user experience.
- The design focuses on core functionality (flashcard creation and persistence) over detailed analytics and metadata tracking.
- Timeouts and cancellations are treated as simple failures in logs, without complex error tracking mechanisms.
