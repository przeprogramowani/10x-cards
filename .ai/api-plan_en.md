# REST API Plan

## 1. Resources

Based on the database schema and PRD, the primary resources for this API are:

1. Users
   - Corresponds to the “users” table (managed by Supabase).

2. Flashcards
   - Corresponds to the “flashcards” table.

3. Generations
   - Corresponds to the “generations” table, recording successful AI flashcard generation attempts.

4. Generation Error Logs
   - Corresponds to the “generation_error_logs” table, recording error details if AI generation fails.

## 2. Endpoints

Below are the core endpoints for each resource, along with descriptions and expected request/response structures. All responses should use standard HTTP status codes. For example:
- 200 for a successful read
- 201 for a successful creation
- 400 for invalid input
- 401 for unauthorized access
- 404 for resources not found
- 500 for server-side errors

### 2.1 Flashcards

These endpoints manage both manually created and AI-generated flashcards.

• GET /api/flashcards
  - Description: Retrieve a paginated list of flashcards for the authenticated user.
  - Query Parameters (optional):
    - page (int)
    - pageSize (int)
    - sortBy (e.g., “created_at”)
    - order (e.g., asc / desc)
  - Response:
    {
      "data": [
        {
          "id": number,
          "user_id": "<uuid>",
          "question": "string",
          "answer": "string",
          "source": "string",
          "created_at": "DateTime",
          "updated_at": "DateTime",
          "generation_id": number | null
        },
        ...
      ],
      "page": number,
      "pageSize": number,
      "totalCount": number
    }

• GET /api/flashcards/:id
  - Description: Retrieve details for a specific flashcard.
  - Response:
    {
      "id": number,
      "user_id": "<uuid>",
      "question": "string",
      "answer": "string",
      "source": "string",
      "created_at": "DateTime",
      "updated_at": "DateTime",
      "generation_id": number | null
    }

• POST /api/flashcards
  - Description: Create a new flashcard (either manually or after editing an AI-generated suggestion).
  - Request Body:
    {
      "question": "string",   // up to 200 chars
      "answer": "string",     // up to 500 chars
      "source": "manual" | "ai-full" | "ai-edited",
      "generation_id": number | null
    }
  - Response:
    {
      "id": number,
      "user_id": "<uuid>",
      "question": "string",
      "answer": "string",
      "source": "string",
      "created_at": "DateTime",
      "updated_at": "DateTime",
      "generation_id": number | null
    }
  - Errors:
    - 400 if validation fails (e.g., question or answer too long).
    - 401 if unauthorized.

• PUT /api/flashcards/:id
  - Description: Update an existing flashcard.
  - Request Body (all fields optional except “question” and “answer” in an update scenario):
    {
      "question": "string",
      "answer": "string"
    }
  - Response:
    {
      "id": number,
      "user_id": "<uuid>",
      "question": "string",
      "answer": "string",
      "source": "string",
      "updated_at": "DateTime"
    }
  - Errors:
    - 400 if invalid input.
    - 404 if flashcard not found or doesn’t belong to the user.

• DELETE /api/flashcards/:id
  - Description: Delete a flashcard.
  - Errors:
    - 404 if not found.
    - 401 if unauthorized.

### 2.2 Generations

These endpoints track or trigger AI-based flashcard generation.

• POST /api/generations
  - Description: Submit source text to the API for AI-based flashcard generation.
  - Request Body:
    {
      "source_text": "string",            // 1000-10000 chars
    }
  - Response:
    {
      "generation_id": number,
      "number_of_suggestions": number,
      "flashcardsProposals": [
        {
          "question": "string",
          "answer": "string",
          "source": "ai-full"
        }
      ]
    }
  - Errors:
    - 400 if text too short or too long.
    - 500 if AI generation request fails (a corresponding Generation Error Log may be created).

• GET /api/generations
  - Description: List past generation attempts for the user, optionally paginated.
  - Query Parameters:
    - page (int)
    - pageSize (int)
  - Response:
    {
      "data": [
        {
          "id": number,
          "user_id": "<uuid>",
          "created_at": "DateTime",
          "model_type": "string",
          "number_of_suggestions": number,
          "source_text_hash": "string",
          "source_text_length": number,
          "generation_time": number
        },
        ...
      ],
      "page": number,
      "pageSize": number,
      "totalCount": number
    }

• GET /api/generations/:id
  - Description: Get details for a specific generation attempt.
  - Response:
    {
      "id": number,
      "user_id": "<uuid>",
      "created_at": "DateTime",
      "model_type": "string",
      "number_of_suggestions": number,
      "source_text_hash": "string",
      "source_text_length": number,
      "generation_time": number,
      "accepted_flashcards_unedited": number | null,
      "accepted_flashcards_edited": number | null
    }

### 2.3 Generation Error Logs

• GET /api/generation-logs
  - Description: Retrieve paginated AI generation error logs for troubleshooting.
  - Query Parameters:
    - page (int)
    - pageSize (int)
  - Response:
    {
      "data": [
        {
          "id": number,
          "user_id": "<uuid>",
          "created_at": "DateTime",
          "model_type": "string",
          "error_code": "string",
          "error_message": "string"
        },
        ...
      ],
      "page": number,
      "pageSize": number,
      "totalCount": number
    }

• GET /api/generation-logs/:id
  - Description: Retrieve a single error log record.
  - Response:
    {
      "id": number,
      "user_id": "<uuid>",
      "created_at": "DateTime",
      "model_type": "string",
      "error_code": "string",
      "error_message": "string"
    }

## 3. Authentication and Authorization

• Supabase Auth:
  - This API plan assumes integration with Supabase’s auth. Each request should include a valid access token (JWT).
  - On the server side, validate the token and extract the `user_id` before accessing or modifying any resource.
  - Row-Level Security (RLS) in PostgreSQL ensures records are only visible to their owner.

• Security Controls:
  - Protect endpoints with middleware checking the user’s token.
  - For any read/write operations, ensure `user_id` from the token matches the `user_id` in the target resource.

## 4. Additional Considerations

• Rate Limiting:
  - Implement a simple rate-limiting policy (e.g., using a middleware) to guard against API abuse (e.g., 100 requests/min per user).

• Caching:
  - For read-heavy endpoints (e.g., listing flashcards), consider short-term caching of responses if usage patterns warrant it. However, with personalized data, caching might be limited or use ETag-based conditional requests.

• Pagination, Filtering, Sorting:
  - All list endpoints (flashcards, generations, logs) should support pagination.
  - Provide optional query parameters (e.g., `sortBy`, `order`) to order results by creation date or other fields.

• Performance Optimizations:
  - Use appropriate indexes (`(user_id, created_at)`) as recommended by the schema to optimize queries.
  - Minimize unnecessary joins or repeated network calls by clearly scoping queries to the user’s `user_id`.
