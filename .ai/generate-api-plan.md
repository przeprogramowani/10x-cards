# Implementation Plan: POST /api/generations Endpoint

## 1. Endpoint Overview
The POST /api/generations endpoint accepts a block of source text from an authenticated user, processes it with an AI-based flashcard generation service, and logs the attempt in the database. On success, it returns metadata about the generation process including suggestions for flashcards. In case of errors, appropriate HTTP error statuses are returned.

## 2. Request Details
- **HTTP Method:** POST
- **URL:** /api/generations
- **Headers:**
  - Authorization: Bearer <JWT_token> (Supabase Auth token)
- **Request Body:**
  ```json
  {
    "source_text": "string" // Must be between 1000 and 10000 characters.
  }
  ```

## 3. Response Details
- **Success (201 Created):**
  ```json
  {
    "generation_id": number,
    "user_id": "<uuid>",
    "created_at": "DateTime",
    "number_of_suggestions": number,
    "flashcards_suggestions": [
      {
        "question": "string",
        "answer": "string",
        "source": "ai-full"
      }
    ]
  }
  ```
- **Error Responses:**
  - **400 Bad Request:** If the source_text is too short, too long, or if the payload is malformed.
  - **401 Unauthorized:** If the authentication token is missing or invalid.
  - **500 Internal Server Error:** If the AI generation fails or any unexpected error occurs.

## 4. Data Flow
1. **Client Request:** The client sends a POST request with the source text.
2. **Authentication:** Middleware validates the JWT token and extracts the user_id.
3. **Validation:** The input is validated using a schema validator (e.g., zod) to ensure the source_text meets the character requirements.
4. **AI Service Call:** The server calls an external AI service to process the source text for flashcard suggestions.
5. **Database Interaction:** On success, generation details are stored in the `generations` table. On failure, an entry may be added to the `generation_error_logs` table.
6. **Response:** The server returns a JSON response with the generation metadata or an error message accordingly.

## 5. Security Considerations
- **Authentication:** Requires a valid JWT token (Supabase Auth) in the Authorization header.
- **Authorization:** Ensure the user_id from the token is used for database operations to enforce row-level security.
- **Input Validation:** Strictly validate the 'source_text' to prevent misuse and injection attacks.
- **Data Sanitization:** Sanitize inputs to mitigate security vulnerabilities such as XSS.
- **Rate Limiting:** Apply middleware to limit the number of requests per minute (e.g., 100 requests per minute per user).

## 6. Error Handling
- **Validation Errors (400):** Return if source_text does not meet the required length or format.
- **Unauthorized Access (401):** Return if the token is missing or invalid.
- **Server Errors (500):** Log detailed error information (possibly in the `generation_error_logs` table) and return a generic error message to the client.

## 7. Performance Considerations
- **Efficient Input Validation:** Use schema validators like zod to quickly validate input data.
- **Rate Limiting:** Implement request rate limiting to prevent resource exhaustion.
- **Database Optimization:** Ensure appropriate indexing (e.g., on user_id and created_at) to maintain performance for insertions and queries.
- **Optimized AI Interaction:** Use timeout and retry logic when communicating with the external AI generation service to handle latency.

## 8. Implementation Steps
1. **Setup Authentication Middleware**
   - Integrate Supabase authentication to validate JWT tokens.
   - Estimated effort: 1-2 days.

2. **Create the API Route**
   - Create the POST /api/generations endpoint in the Astro project under `./src/pages/api/`.
   - Estimated effort: 1 day.

3. **Input Validation**
   - Use a schema validation library (e.g., zod) to validate that the source_text is between 1000 and 10000 characters.
   - Estimated effort: 1 day.

4. **Integrate AI Generation Service**
   - Implement logic to call the external AI service, handle responses, and manage error conditions.
   - Estimated effort: 2-3 days.

5. **Database Operations**
   - Develop functions to insert generation data into the `generations` table and log errors in `generation_error_logs` if needed.
   - Estimated effort: 1-2 days.

6. **Error Handling and Logging**
   - Implement comprehensive error logging and return user-friendly error responses.
   - Estimated effort: 1 day.
