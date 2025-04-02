/*
API Endpoint Implementation Plan: POST /api/generations

1. Przegląd punktu końcowego
--------------------------------------------------
Cel endpointu: Umożliwienie użytkownikowi przesłania tekstu, który zostanie przetworzony przez system AI w celu automatycznej generacji propozycji fiszek. Endpoint zapisuje szczegóły generacji w bazie danych oraz zwraca metadane razem z wygenerowanymi propozycjami fiszek.

2. Szczegóły żądania
--------------------------------------------------
- Metoda HTTP: POST
- Struktura URL: /api/generations
- Parametry:
  - Wymagane:
    - source_text (string) – tekst wejściowy o długości 1000-10000 znaków
  - Opcjonalne: Brak
- Request Body (JSON):
  {
    "source_text": "string"
  }

3. Szczegóły odpowiedzi
--------------------------------------------------
- Status kodu: 201 (Created) w przypadku powodzenia
- Struktura odpowiedzi (JSON):
  {
    "generation_id": number,
    "user_id": "<uuid>",
    "created_at": "DateTime",
    "model_type": "string",
    "number_of_suggestions": number,
    "source_text_hash": "string",
    "source_text_length": number,
    "generation_time": number, // w milisekundach
    "flashcardsProposals": [
      {
        "question": "string",
        "answer": "string",
        "source": "ai-full"
      }
    ]
  }

4. Przepływ danych
--------------------------------------------------
- Autoryzacja: Middleware uwierzytelnia żądanie wykorzystując token JWT z Supabase; RLS kontroluje dostęp do danych.
- Walidacja: Użycie schematu walidacji (np. zod) dla sprawdzenia, że "source_text" jest częścią treści oraz że jego długość mieści się w dozwolonym zakresie.
- Logika biznesowa:
  - Przekazanie tekstu do usługi GenerationService, która:
    • Weryfikuje i formatuje dane
    • Wywołuje zewnętrzny serwis AI (w razie potrzeby) do wygenerowania propozycji fiszek
    • Oblicza hash oraz mierzy czas generacji
    • Zapisuje wynik w tabeli generations
  - W przypadku błędów podczas wywołania AI lub operacji bazy danych, rejestruje szczegóły w tabeli generation_error_logs.
- Odpowiedź: Po pomyślnej operacji, formularz odpowiedzi zawiera wszystkie wymagane dane generacji oraz listę wygenerowanych fiszek.

5. Względy bezpieczeństwa
--------------------------------------------------
- Walidacja wejścia: Zapewnienie, że "source_text" jest poprawnego typu i długości, aby zapobiec atakom typu injection.
- Rejestracja błędów: Każdy błąd krytyczny zapisywany jest w tabeli generation_error_logs, co pozwala na późniejszą analizę i debugowanie.

6. Obsługa błędów
--------------------------------------------------
- 400 Bad Request: Jeśli "source_text" jest zbyt krótki (<1000 znaków) lub zbyt długi (>10000 znaków).
- 401 Unauthorized: Jeśli żądanie nie zawiera ważnego tokena lub użytkownik nie jest uwierzytelniony (obsługiwane globalnie przez middleware).
- 500 Internal Server Error: Wystąpienie błędu podczas wywołania serwisu AI lub operacji na bazie danych; dodatkowo logowany błąd w generation_error_logs.

7. Rozważania dotyczące wydajności
--------------------------------------------------
- Skalowalność: Asynchroniczne wywołanie serwisu AI może zwolnić główny wątek i umożliwić obsługę dużej liczby żądań.
- Buforowanie: Rozważenie krótkoterminowego buforowania wyników generacji, jeśli logika AI nie zmienia się często.

8. Etapy wdrożenia
--------------------------------------------------
1. Utworzenie endpointu w ścieżce /src/pages/api/generations.ts.
2. Zdefiniowanie schematu walidacji dla request body (np. zod), sprawdzającego długość "source_text".
3. Stworzenie lub integracja z modułem GenerationService:
   - Implementacja logiki wywołania usługi AI.
   - Obsługa obliczania hash, mierzenie czasu generacji oraz formowanie odpowiedzi.
4. Operacja zapisu rekordu w tabeli generations; w przypadku błędów zapisywanie logu w generation_error_logs.
5. Zwrócenie poprawnej odpowiedzi (kod 201) lub obsługa błędów (kody 400/500).
*/