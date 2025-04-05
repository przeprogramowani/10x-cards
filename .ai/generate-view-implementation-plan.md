/*
Plan implementacji widoku generowania fiszek

## 1. Przegląd
Widok generowania fiszek umożliwia użytkownikowi wprowadzenie tekstu (od 1000 do 10 000 znaków) oraz uzyskanie propozycji fiszek generowanych przez AI. Użytkownik może przeglądać, akceptować, edytować lub odrzucać poszczególne fiszki, a następnie zapisać wybrane fiszki do bazy danych za pomocą przycisków 'Zapisz wszystkie' lub 'Zapisz zaakceptowane'.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/generate`.

## 3. Struktura komponentów
- **GenerateView** (główny komponent widoku)
  - **TextAreaInput**: Pole do wprowadzania tekstu
  - **GenerateButton**: Przycisk do inicjowania procesu generacji
  - **Loader**: Skeleton do ładowania
  - **FlashcardsProposalsList**: Lista wyświetlająca propozycje fiszek
    - **FlashcardProposalItem**: Pojedynczy element listy z opcjami (zaakceptuj, edytuj, odrzuć)
  - **BulkSaveButtons**: Zestaw przycisków ("Zapisz wszystkie", "Zapisz zaakceptowane")
  - **Toast**: Komponent do wyświetlania komunikatów o błędach i sukcesach

## 4. Szczegóły komponentów
### GenerateView
- **Propsy**: Brak – główny kontener widoku odpowiadający za zarządzanie stanem
- **Główne elementy**: Layout widoku, kompozycja powyższych komponentów
- **Interakcje**: Przekazywanie danych i callbacków do podkomponentów, zarządzanie globalnym stanem widoku

### TextAreaInput
- **Propsy**:
  - `value: string` – aktualna zawartość pola
  - `onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void` – funkcja obsługująca zmiany
  - `error?: string` – komunikat błędu walidacji
- **Główne elementy**: Pole tekstowe, widoczny komunikat błędu (jeśli występuje)
- **Interakcje**: Aktualizacja stanu wejściowego, walidacja długości tekstu w czasie rzeczywistym
- **Walidacja**: Długość tekstu musi być między 1000 a 10000 znakami

### GenerateButton
- **Propsy**:
  - `onClick: () => void` – wywołanie funkcji generacji
  - `disabled: boolean` – status przycisku (np. gdy walidacja nie przechodzi lub trwa operacja)
- **Główne elementy**: Przycisk z etykietą "Generuj"
- **Interakcje**: Inicjowanie wywołania API i aktualizacja stanu ładowania

### Loader
- **Propsy**:
  - `visible: boolean` – wyświetlanie komponentu
- **Główne elementy**: Skeleton
- **Interakcje**: Pojawia się podczas oczekiwania na odpowiedź z API

### FlashcardsProposalsList
- **Propsy**:
  - `flashcards: FlashcardProposalDto[]` – lista propozycji fiszek
  - `onAccept: (index: number) => void` – funkcja akceptacji fiszki. Walidacja czy front i back są wypełnione. Front do 200 znaków, back do 500 znaków.
  - `onEdit: (index: number, newFlashcard: FlashcardProposalDto) => void` – funkcja edycji fiszki, po akceptacji zmian source zmienia się na "ai-edited".
  - `onReject: (index: number) => void` – funkcja odrzucenia fiszki, wymaga potwierdzenia poprzez modal.
- **Główne elementy**: Lista wyświetlająca poszczególne fiszki
- **Interakcje**: Obsługa akcji dla pojedynczych fiszek (zaakceptuj, edytuj, odrzuć)

### FlashcardProposalItem
- **Propsy**:
  - `data: FlashcardProposalDto` – dane fiszki
  - `onAccept: () => void`, `onEdit: () => void`, `onReject: () => void` – callbacki dla akcji
- **Główne elementy**: Wyświetlanie treści fiszki (przód i tył), przyciski akcji
- **Interakcje**: Reagowanie na kliknięcia przycisków i wywoływanie odpowiednich callbacków

### BulkSaveButtons
- **Propsy**:
  - `onSaveAll: () => void` – akcja zapisu wszystkich fiszek, która czyni je zaakceptowanymi.
  - `onSaveAccepted: () => void` – akcja zapisu zaakceptowanych fiszek
  - `disabled: boolean` – stan przycisków
- **Główne elementy**: Dwa przyciski do zbiorczego zapisu
- **Interakcje**: Inicjowanie odpowiednich akcji zapisu po kliknięciu

### Toast
- **Propsy**:
  - `message: string` – treść komunikatu
  - `type: "error" | "success"` – typ komunikatu
  - `onClose: () => void` – zamknięcie komunikatu
- **Główne elementy**: Wyświetlanie komunikatów o błędach lub sukcesach
- **Interakcje**: Pojawianie się i ukrywanie komunikatów na żądanie

## 5. Typy
- **GenerateFlashcardsCommand** - zdefiniowany w `types.ts` jako:
  { source_text: string; }
- **GenerationCreateResponseDto**: Zdefiniowany w `types.ts` jako:
  {
    generation_id: number;
    flashcards_proposals: FlashcardProposalDto[];
    generated_count: number;
  }
- **FlashcardProposalDto**: Zdefiniowany w `types.ts` jako:
  { front: string; back: string; source: "ai-full"; }
- **FlashcardProposalViewModel**: Nowy typ odwzorowujący stan widoku, zawierający:
  {
    front: string;
    back: string;
    source: "ai-full" | "ai-edited";
    isAccepted: boolean;
    isEdited: boolean;
  }
- **FlashcardCreateCommand**: Zdefiniowany w `types.ts` jako:
  { flashcards: { front: string; back: string; source: "ai-full" | "ai-edited"; generation_id: number; }[] }
- **GenerateViewModel**: Nowy typ odwzorowujący stan widoku, zawierający:
  - `inputText: string`
  - `loading: boolean`
  - `error: string | null`
  - `flashcards: FlashcardProposalDto[]`
  - `generationId: number | null`
- Dodatkowe typy dla zdarzeń akceptacji, edycji i odrzucenia, jeśli są potrzebne

## 6. Zarządzanie stanem
- Użycie hooków React (`useState`, `useEffect`) do zarządzania:
  - Stanem pola tekstowego
  - Stanem ładowania
  - Listą propozycji fiszek
  - Obsługą błędów
- Stworzenie custom hooka `useGenerateView` w celu enkapsulacji logiki biznesowej, w tym walidacji, wywołań API i zarządzania stanem

## 7. Integracja API
- **POST `/generations`**:
  - Wywołanie podczas kliknięcia przycisku "Generuj" z przesłaniem danych `{ source_text }`.
  - Otrzymanie odpowiedzi zawierającej `generation_id`, `flashcards_proposals` oraz `generated_count`.
  - Aktualizacja stanu widoku na podstawie otrzymanych danych.
- **POST `/flashcards`**:
  - Wywołanie po kliknięciu przycisków zapisu (zapisz wszystkie lub zapis zaakceptowane).
  - Przesłanie zbioru danych fiszek w odpowiednim formacie (z uwzględnieniem walidacji front, back, source, generation_id).
  - Obsługa odpowiedzi API oraz wyświetlanie toastów w przypadku sukcesu lub błędu

## 8. Interakcje użytkownika
- Użytkownik wpisuje tekst w pole tekstowe, widzi walidację w trybie inline.
- Po kliknięciu przycisku "Generuj":
  - Aktywowany zostaje loader
  - Wywoływane jest API, a następnie wyświetlana jest lista proponowanych fiszek
- Użytkownik może:
  - Akceptować fiszki – oznaczenie ich do zapisu
  - Edytować fiszki – modyfikacja tekstu fiszki
  - Odrzucać fiszki – usunięcie ich z listy po potwierdzeniu w modalu
- Po dokonaniu wyborów, użytkownik klika jeden z przycisków zbiorczego zapisu

## 9. Warunki i walidacja
- Walidacja długości pola tekstowego: minimum 1000, maksimum 10000 znaków
- Sprawdzenie, czy każde pole fiszki (front, back) jest poprawnie wypełnione. Front do 200 znaków, back do 500 znaków.
- Dezaktywacja przycisków, jeśli warunki wejściowe nie są spełnione (np. zbyt krótki tekst, brak propozycji)
- Walidacja przed wysłaniem danych do API

## 10. Obsługa błędów
- Wyświetlanie komunikatów błędów inline oraz przy użyciu Toast/Alert
- Obsługa błędów zwracanych przez API (kod 400 lub 500) – wyświetlenie odpowiednich komunikatów użytkownikowi
- Resetowanie stanu ładowania w przypadku wystąpienia błędu

## 11. Uwagi dotyczące wydajności
- Optymalizacja liczby renderowań przez odpowiednie zarządzanie stanem
- Lazy loading komponentów, które nie muszą być renderowane natychmiast
- Użycie memoizacji (React.memo, useMemo) dla komponentów listy, gdy lista fiszek jest duża

## 12. Kroki implementacji
1. Utworzenie głównego komponentu `GenerateView` z bazowym layoutem widoku
2. Implementacja komponentu `TextAreaInput` z walidacją długości tekstu
3. Implementacja komponentu `GenerateButton` oraz logiki wywołania API POST `/generations`
4. Utworzenie komponentu `Loader` do wskazywania stanu ładowania
5. Implementacja komponentów `FlashcardsProposalsList` oraz `FlashcardProposalItem` do wyświetlania propozycji fiszek
6. Dodanie mechanizmów akceptacji, edycji i odrzucenia pojedynczych fiszek
7. Utworzenie komponentu `BulkSaveButtons` i integracja z API POST `/flashcards`
8. Dodanie systemu Toast do obsługi komunikatów sukcesu i błędów
9. Testowanie interakcji użytkownika oraz walidacji warunków wejściowych
10. Optymalizacja wydajności oraz refaktoryzacja kodu w oparciu o feedback
*/