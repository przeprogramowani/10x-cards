## 1. Tabele

### Tabela: users
Zarządzana przez Supabase.

### Tabela: flashcards
Przechowuje fiszki (zarówno ręcznie dodane, jak i wygenerowane przez AI).

- id (BIGSERIAL, PRIMARY KEY)
- user_id (UUID, NOT NULL)
  - Klucz obcy (FK) → users.user_id
- question (VARCHAR(200), NOT NULL)
- answer (VARCHAR(500), NOT NULL)
- source (VARCHAR, NOT NULL)
  - Oczekiwane wartości: 'manual', 'ai-full', 'ai-edited'
  - Można wykorzystać CHECK CONSTRAINT
- created_at (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT NOW())
- updated_at (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT NOW())

Ograniczenia:
1. CONSTRAINT flashcards_question_length CHECK (char_length(question) <= 200)
2. CONSTRAINT flashcards_answer_length CHECK (char_length(answer) <= 500)
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
  - Każdy użytkownik może mieć wiele rekordów w tabeli generations.
- Tabela `users` → Tabela `generation_error_logs` relacja 1:N
  - Każdy użytkownik może mieć wiele wpisów w logach błędów.

## 3. Indeksy

Przykładowe, rekomendowane indeksy:

- CREATE INDEX ON flashcards (user_id);
- CREATE INDEX ON flashcards (created_at);
- CREATE INDEX ON generations (user_id);
- CREATE INDEX ON generations (created_at);
- CREATE INDEX ON generation_error_logs (user_id);
- CREATE INDEX ON generation_error_logs (created_at);

Dodatkowo można rozważyć indeksy wielokolumnowe, np. `(user_id, created_at)` w tabelach z dużą liczbą rekordów i częstymi zapytaniami filtrującymi po tych kolumnach.

## 4. Zasady PostgreSQL (RLS)

Zgodnie z założeniami z notatek, przy włączonym Row-Level Security (RLS) można ustawić polityki ograniczające dostęp do wierszy na podstawie `user_id`. Przykładowa konfiguracja:

```sql
-- Włącz RLS
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Polityka zezwalająca użytkownikowi na dostęp wyłącznie do własnych rekordów
CREATE POLICY select_own_flashcards ON flashcards
  FOR SELECT
  TO public
  USING (user_id = current_setting('app.current_user_id')::uuid);

-- Polityka wstawiania: użytkownik może wstawić rekord, gdy user_id jest tożsamy z current_user_id
CREATE POLICY insert_own_flashcards ON flashcards
  FOR INSERT
  TO public
  WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);

-- Analogiczne polityki dla aktualizacji i usuwania
CREATE POLICY update_own_flashcards ON flashcards
  FOR UPDATE
  TO public
  USING (user_id = current_setting('app.current_user_id')::uuid)
  WITH CHECK (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY delete_own_flashcards ON flashcards
  FOR DELETE
  TO public
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

Identyczne zasady należy wdrożyć w tabelach `generations` i `generation_error_logs`.

## 5. Dodatkowe uwagi

1. Identyfikator użytkownika (`user_id`) w tabelach `flashcards`, `generations` i `generation_error_logs` powinien być spójny z wartością zarządzaną przez mechanizm auth Supabase.
2. Domyślne wartości timestamp (`DEFAULT NOW()`) zapewniają rejestrowanie czasu zdarzenia bez dodatkowych operacji ze strony aplikacji.
3. Kolumna `source` w tabeli `flashcards` umożliwia odróżnienie fiszek utworzonych ręcznie od pochodzących z AI (pełnych lub edytowanych).
4. Limity znaków (200 i 500) w tabeli `flashcards` zostały wymuszone przez CHECK CONSTRAINT – można je również sprawdzać po stronie aplikacji w formularzach.
5. Należy zadbać o regularne porządkowanie tabel `generation_error_logs`, jeśli liczba błędów bywa wysoka (np. poprzez mechanizmy archiwizacji lub retencji).

Ten schemat zapewnia przejrzystą strukturę bazy danych, obsługującą wszystkie kluczowe funkcjonalności aplikacji, a jednocześnie umożliwia późniejsze rozszerzenia lub dostosowania.