# API Endpoint Implementation Plan: POST /flashcards

## 1. Przegląd punktu końcowego
Endpoint POST /flashcards służy do tworzenia jednego lub wielu flashcards. Umożliwia zapisywanie fiszek zarówno tworzonych ręcznie, jak i generowanych przez AI, zapewniając przy tym ścisłą walidację danych wejściowych oraz odpowiednie powiązanie z rekordem generacji (jeśli dotyczy).

## 2. Szczegóły żądania
- Metoda HTTP: POST
- Struktura URL: /flashcards
- Parametry:
  - Wymagane:
    - Request Body (JSON) zawierające pole "flashcards", które jest tablicą obiektów flashcard.
    - Każdy obiekt flashcard musi zawierać:
      - front (string, maksymalnie 200 znaków)
      - back (string, maksymalnie 500 znaków)
      - source (string, jedna z wartości: "ai-full", "ai-edited", "manual")
      - generation_id (number lub null; wymagane dla "ai-full" i "ai-edited", musi być null dla "manual")
  - Opcjonalne: Brak dodatkowych parametrów.

## 3. Wykorzystywane typy
- FlashcardCreateDto – definiuje strukturę pojedynczej fiszki do utworzenia.
- FlashcardsCreateCommand – zawiera tablicę obiektów FlashcardCreateDto.
- FlashcardDto – reprezentuje stworzony flashcard zwracany w odpowiedzi.

## 4. Szczegóły odpowiedzi
- Sukces:
  - Kod statusu: 201 (Created) dla pomyślnego utworzenia flashcards.
  - Struktura JSON:
    ```json
    {
      "flashcards": [
        { "id": <number>, "front": "<string>", "back": "<string>", "source": "<string>", "generation_id": <number | null> },
        ...
      ]
    }
    ```
- Błędy:
  - 400: Błędne dane wejściowe (np. przekroczenie dozwolonej długości pól, niepoprawna wartość source, błędne generation_id).
  - 401: Brak autoryzacji dostępu.
  - 500: Błędy serwera lub problemy przy zapisie do bazy danych.

## 5. Przepływ danych
1. Klient wysyła żądanie POST z ciałem zawierającym tablicę obiektów flashcards.
2. Warstwa API (np. w `/src/pages/api/flashcards.ts`) odbiera żądanie i weryfikuje autoryzację użytkownika.
3. Dane są walidowane pod kątem:
   - Długości pól (front i back),
   - Poprawności wartości pola source,
   - Sprawdzenia zgodności generation_id z wartością source.
4. W przypadku poprawnej walidacji wywoływany jest serwis (`src/lib/flashcard.service.ts`), który implementuje logikę biznesową:
   - Obsługa logiki tworzenia flashcards,
   - Powiązanie flashcards z użytkownikiem (user_id).
5. Flashcards są zapisywane do bazy danych przy użyciu operacji batch insert.
6. W przypadku wystąpienia błędów podczas zapisu następuje rollback operacji, a klient otrzymuje odpowiedni błąd.

## 6. Względy bezpieczeństwa
- Uwierzytelnienie: Endpoint musi być dostępny tylko dla autoryzowanych użytkowników (np. przez Supabase Auth).
- Autoryzacja: Sprawdzenie, czy użytkownik ma prawo tworzyć flashcards oraz powiązać je z generacją.
- Walidacja danych wejściowych: Dokładna walidacja i sanitizacja danych wejściowych dla zapobiegania atakom (np. SQL injection).

## 7. Obsługa błędów
- 400 – Invalid Input:
  - Zwracane, gdy dane wejściowe nie spełniają wymagań walidacyjnych, np. niepoprawna długość pól, niewłaściwa wartość source, błędne generation_id.
- 401 – Unauthorized:
  - Zwracane, gdy użytkownik nie jest zalogowany lub nie ma odpowiednich uprawnień.
- 500 – Internal Server Error:
  - Zwracane w przypadku błędów serwera lub problemów z bazą danych.
- Dodatkowo: Możliwe logowanie błędów (i opcjonalne zapisywanie w tabeli generation_error_logs, jeżeli endpoint ma współpracować również z modułem AI generującym flashcards).

## 8. Rozważania dotyczące wydajności
- Batch Processing: Efektywne przetwarzanie wielu flashcards w jednym żądaniu poprzez wykorzystanie operacji batch insert.

## 9. Etapy wdrożenia
1. Utworzenie nowego endpointu w katalogu `/src/pages/api/flashcards.ts`.
2. Implementacja walidacji danych wejściowych przy użyciu biblioteki takiej jak Zod lub Joi, zgodnie z regułami walidacji:
   - Maksymalna długość `front` (200 znaków) i `back` (500 znaków).
   - Weryfikacja poprawności wartości `source` i odpowiadającego `generation_id`.
3. Utworzenie lub modyfikacja serwisu biznesowego (FlashcardService, `src/lib/flashcard.service.ts`) odpowiedzialnego za tworzenie flashcards, który będzie zarządzał operacjami na bazie danych.
4. Integracja z bazą danych: Implementacja operacji batch insert dla tabeli `flashcards` oraz zapewnienie powiązania flashcards z `user_id` i, jeśli dotyczy, z `generation_id`.
5. Dodanie mechanizmu obsługi błędów wraz z odpowiednim logowaniem oraz implementacją rollback w przypadku nieudanej operacji.
