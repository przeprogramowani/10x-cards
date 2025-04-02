### Tabela: auth.users
- id (UUID, PRIMARY KEY)
- email (VARCHAR, NOT NULL)
- created_at (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT NOW())

Zarządzana przez Supabase.

### Tabela: flashcards
Przechowuje fiszki (zarówno ręcznie dodane, jak i wygenerowane przez AI).

- id (BIGSERIAL, PRIMARY KEY)
- user_id (UUID, NOT NULL)
  - Klucz obcy (FK) → users.user_id
- front (VARCHAR(200), NOT NULL)
- back (VARCHAR(500), NOT NULL)
- source (VARCHAR, NOT NULL)
  - Oczekiwane wartości: 'manual', 'ai-full', 'ai-edited'
  - Należy wykorzystać CHECK CONSTRAINT
- created_at (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT NOW())

Ograniczenia:
1. CONSTRAINT flashcards_front_length CHECK (char_length(front) <= 200)
2. CONSTRAINT flashcards_back_length CHECK (char_length(back) <= 500)
3. CONSTRAINT flashcards_source_enum CHECK (source IN ('manual', 'ai-full', 'ai-edited'))

### Tabela: generations
Rejestruje szczegóły każdej udanej próby generowania fiszek przez AI.

- id (BIGSERIAL, PRIMARY KEY)
- user_id (UUID, NOT NULL)
  - Klucz obcy (FK) → users.user_id
- created_at (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT NOW())
- model_type (VARCHAR, NOT NULL)
- number_of_suggestions (INTEGER, NOT NULL)
- source_text_hash (VARCHAR, NOT NULL)
- source_text_length (INTEGER, NOT NULL)
- generation_time (INTEGER, NOT NULL)
  - Czas (w milisekundach) potrzebny na generację
- accepted_flashcards_unedited (INTEGER, NULLABLE)
- accepted_flashcards_edited (INTEGER, NULLABLE)

### Tabela: generation_error_logs
Przechowuje informacje o błędach powstałych przy generowaniu fiszek przez AI.

- id (BIGSERIAL, PRIMARY KEY)
- user_id (UUID, NOT NULL)
  - Klucz obcy (FK) → users.user_id
- created_at (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT NOW())
- model_type (VARCHAR, NOT NULL)
- source_text_hash (VARCHAR, NOT NULL)
- source_text_length (INTEGER, NOT NULL)
- generation_time (INTEGER, NOT NULL)
- error_code (VARCHAR, NOT NULL)
- error_message (TEXT, NOT NULL)

## 2. Relacje między tabelami

- Tabela `users` → Tabela `flashcards` relacja 1:N
  - Każdy użytkownik może mieć wiele fiszek (flashcards).
- Tabela `users` → Tabela `generations` relacja 1:N
  - Każdy użytkownik może mieć wiele rekordów w tabeli pokoleń.
- Tabela `users` → Tabela `generation_error_logs` relacja 1:N
  - Każdy użytkownik może mieć wiele wpisów w logach błędów.