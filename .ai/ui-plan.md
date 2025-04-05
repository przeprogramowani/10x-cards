# Architektura UI dla 10xCards

## 1. Przegląd struktury UI

Cały interfejs użytkownika został zaprojektowany jako modułowa aplikacja webowa z wyraźnym podziałem na kluczowe widoki. Wykorzystuje Astro 5 do statycznych stron oraz React 19 do dynamicznych komponentów, przy użyciu Tailwind 4 i gotowych komponentów z biblioteki Shadcn/ui. Struktura koncentruje się na prostocie i wydajności, z naciskiem na dostępność (WCAG AA) i bezpieczeństwo (integracja z backendem Supabase, mechanizmy RLS i JWT). Stan aplikacji zarządzany jest początkowo przy użyciu wbudowanych hooków React oraz React Context, z możliwością rozszerzenia do biblioteki Zustand w przyszłych iteracjach.

## 2. Lista widoków

### 2.1. Ekran uwierzytelniania

- **Ścieżka widoku:** `/auth`
- **Główny cel:** Umożliwić użytkownikowi rejestrację oraz logowanie do systemu.
- **Kluczowe informacje do wyświetlenia:** Formularz logowania/rejestracji, komunikaty o błędach walidacji, przyciski nawigacyjne do przełączania między trybami.
- **Kluczowe komponenty widoku:** Formularz logowania, formularz rejestracji, pola z walidacją, komunikaty inline.
- **UX, dostępność i względy bezpieczeństwa:** Wsparcie dla klawiatury, czytelne komunikaty błędów, zabezpieczenie danych (maskowanie hasła) oraz obsługa JWT.

### 2.2. Dashboard

- **Ścieżka widoku:** `/dashboard` lub główny widok po zalogowaniu
- **Główny cel:** Centralny punkt nawigacyjny umożliwiający szybki dostęp do głównych funkcjonalności aplikacji.
- **Kluczowe informacje do wyświetlenia:** Podsumowanie aktywności użytkownika, szybki dostęp do generowania fiszek, listy fiszek, sesji powtórkowych i panelu użytkownika.
- **Kluczowe komponenty widoku:** Pasek nawigacyjny, karty skrótów, panel powiadomień, dynamiczne widgety.
- **UX, dostępność i względy bezpieczeństwa:** Intuicyjna nawigacja, responsywność, poprawne oznaczenia ARIA i czytelność interfejsu.

### 2.3. Widok generowania fiszek

- **Ścieżka widoku:** `/generate`
- **Główny cel:** Umożliwić użytkownikowi wprowadzenie tekstu oraz generowanie propozycji fiszek przez AI.
- **Kluczowe informacje do wyświetlenia:** Pole do wprowadzania tekstu (1000-10000 znaków), przycisk "Generuj", lista propozycji fiszek, komunikaty o błędach i sukcesie, informacja o postępie ładowania.
- **Kluczowe komponenty widoku:** TextArea, przycisk akcji, lista wyników, loader, dwa przyciski zapisu zbiorczego (zapisz wszystkie, zapisz zaakceptowane), opcje edycji/akceptacji/odrzucenia pojedynczych fiszek.
- **UX, dostępność i względy bezpieczeństwa:** Walidacja wejścia na poziomie klienta, czytelne i responsywne UI, komunikaty inline dla błędnych operacji, komunikaty toast dla sukcesów, oraz ochrona przed nadużyciami.

### 2.4. Widok listy fiszek (zarządzanie fiszkami)

- **Ścieżka widoku:** `/flashcards`
- **Główny cel:** Wyświetlenie listy już zapisanych fiszek z możliwością edycji i usuwania.
- **Kluczowe informacje do wyświetlenia:** Lista fiszek, przyciski edycji i usuwania, możliwość filtrowania i sortowania wyników, stan zapisu zmian.
- **Kluczowe komponenty widoku:** Tabela/lista fiszek, modal edycji, przyciski akcji, formularze walidacji.
- **UX, dostępność i względy bezpieczeństwa:** Obsługa komunikatów inline przy edycji, responsywność, potwierdzenia operacji usuwania (modal potwierdzający) oraz spójność interfejsu dla użytkownika.

### 2.5. Panel użytkownika

- **Ścieżka widoku:** `/profile`
- **Główny cel:** Zarządzanie danymi użytkownika, dostęp do ustawień konta i informacji o aktywności.
- **Kluczowe informacje do wyświetlenia:** Dane profilu użytkownika, opcje zmiany hasła, ustawienia konta, informacja o logowaniu (ostatnia aktywność).
- **Kluczowe komponenty widoku:** Formularze zarządzania kontem, karty informacyjne, przyciski akcji.
- **UX, dostępność i względy bezpieczeństwa:** Ochrona danych przez autoryzację, przejrzysty interfejs, responsywność, silne zabezpieczenia przy modyfikacji danych.

### 2.6. Ekran sesji powtórkowych

- **Ścieżka widoku:** `/review`
- **Główny cel:** Umożliwić użytkownikowi przeprowadzenie sesji nauki wykorzystującej algorytm powtórek (spaced repetition).
- **Kluczowe informacje do wyświetlenia:** Aktualna fiszka (przód i tył), przycisk 'Pokaż odpowiedź', opcje oceniania (np. oceny zapamiętania), licznik postępów sesji.
- **Kluczowe komponenty widoku:** Komponent prezentacji fiszki, przyciski akcji, licznik/slider do oceniania, pasek postępu.
- **UX, dostępność i względy bezpieczeństwa:** Intuicyjna interakcja, wsparcie dla technologii asystujących, czytelne komunikaty i potwierdzenia, zabezpieczenie danych sesji.

## 3. Mapa podróży użytkownika

1. Użytkownik odwiedza stronę główną, która przekierowuje do ekranu uwierzytelniania (`/auth`).
2. Po pomyślnej rejestracji lub logowaniu, użytkownik trafia do Dashboardu (`/dashboard`).
3. Z Dashboardu użytkownik wybiera widok generowania fiszek (`/generate`):
   - Wprowadza tekst zgodny z wymaganiami (1000-10000 znaków).
   - Otrzymuje propozycje fiszek od AI.
   - Akceptuje, edytuje lub odrzuca poszczególne fiszki.
   - Zbiorczo zapisuje zaakceptowane zmiany przy pomocy przycisku "Zapisz wszystkie".
4. Po zapisaniu, użytkownik przechodzi do widoku listy fiszek (`/flashcards`), gdzie może zarządzać, edytować lub usuwać fiszki.
5. Użytkownik może również przejść do panelu użytkownika (`/profile`) w celu zmiany ustawień konta lub przeglądu informacji.
6. W przypadku rozpoczęcia sesji nauki, użytkownik wybiera Ekran sesji powtórkowych (`/review`), gdzie system prezentuje fiszki na zasadzie spaced repetition.
7. Nawigacja pomiędzy widokami odbywa się poprzez stały pasek lub menu nawigacyjne dostępne na wszystkich stronach po autoryzacji.

## 4. Układ i struktura nawigacji

- **Główna nawigacja:** Umieszczona w nagłówku w ramach współdzielonego layoutu, zapewniająca dostęp do: generowania fiszek, listy fiszek, sesji nauki oraz panelu użytkownika.
- **Nawigacja mobilna:** Zastosowanie responsywnych utility classes Tailwind (sm:, md:, lg:) zapewniających intuicyjność w wersji mobilnej.
- **Menu kontekstowe i modalne:** Szybki dostęp do akcji edycji lub potwierdzających operacji (np. usunięcia) wewnątrz widoków.
- **Powiadomienia:** Komponenty toastów oraz komunikatów inline dla błędów i sukcesów, widoczne globalnie w aplikacji.

## 5. Kluczowe komponenty

- **Formularze uwierzytelniania:** Komponenty logowania i rejestracji z walidacją na poziomie klienta.
- **Komponent generowania fiszek:** TextArea z walidacją, przycisk generowania, lista propozycji z opcjami edycji/akceptacji.
- **Lista fiszek i modal edycji:** Widok prezentujący zapisane fiszki z możliwością edycji w wyskakującym oknie modalnym oraz opcją usuwania.
- **Komponent sesji powtórkowych:** Prezentacja pojedynczych fiszek, przycisk odsłaniania odpowiedzi, mechanizm oceniania oraz wskaźnik postępu.
- **Nawigacja:** Pasek lub boczny panel z dostępem do głównych widoków wraz z responsywnymi adaptacjami.
- **Powiadomienia (toasty):** Globalny system komunikatów informujących o sukcesach oraz błędach, ułatwiający interakcję z użytkownikiem.