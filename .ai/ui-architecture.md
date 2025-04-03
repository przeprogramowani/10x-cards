# Architektura UI dla 10xCards

## 1. Przegląd struktury interfejsu użytkownika

Struktura interfejsu opiera się na responsywnym designie, wykorzystując technologie Astro, React oraz Tailwind. Głównym założeniem jest zapewnienie spójnego i intuicyjnego doświadczenia, w którym każdy widok współpracuje bezproblemowo z backendowymi punktami API. Interfejs jest zbudowany przy użyciu komponentów Shadcn/ui oraz niestandardowych rozwiązań dla specyficznych wymagań aplikacji, przy jednoczesnym zapewnieniu wysokich standardów bezpieczeństwa, dostępności i wydajności.

## 2. Lista widoków

### 2.1. Ekran logowania/rejestracji
- **Główny cel:** Umożliwienie użytkownikowi logowania oraz rejestracji w systemie.
- **Kluczowe informacje:** Formularz logowania z polami: e-mail i hasło, opcja rejestracji dla nowych użytkowników.
- **Kluczowe komponenty:** Formularz, pola input, przycisk submit, link do rejestracji.
- **UX, dostępność i bezpieczeństwo:** Intuicyjna nawigacja po formularzu, walidacja wejścia, wsparcie dla czytników ekranu, szyfrowanie danych logowania.

### 2.2. Dashboard (Moje fiszki)
- **Główny cel:** Przegląd i zarządzanie fiszkami użytkownika.
- **Kluczowe informacje:** Lista fiszek (pytanie, odpowiedź, źródło, daty), podsumowanie statystyk oraz opcje edycji i usuwania.
- **Kluczowe komponenty:** Karty fiszek, lista, filtry, przyciski edycji/usuwania, paginacja.
- **UX, dostępność i bezpieczeństwo:** Przejrzysty layout, responsywność, możliwość sortowania i filtrowania, ograniczony dostęp tylko do danych użytkownika.

### 2.3. Ekran szczegółów/edycji fiszki
- **Główny cel:** Wyświetlenie szczegółowych informacji o wybranej fiszce oraz umożliwienie jej edycji.
- **Kluczowe informacje:** Pytanie, odpowiedź, źródło, daty utworzenia i ostatniej modyfikacji.
- **Kluczowe komponenty:** Formularz edycyjny, przyciski zapisu i anulowania.
- **UX, dostępność i bezpieczeństwo:** Intuicyjne edytowanie z natychmiastową walidacją, komunikaty o błędach, zabezpieczenie wysyłanych danych.

### 2.4. Ekran tworzenia fiszki ręcznie
- **Główny cel:** Umożliwienie użytkownikowi ręcznego stworzenia nowej fiszki.
- **Kluczowe informacje:** Pola do wprowadzenia pytania oraz odpowiedzi, opcjonalnie notatki dodatkowe.
- **Kluczowe komponenty:** Formularz z polami tekstowymi, przycisk utworzenia fiszki.
- **UX, dostępność i bezpieczeństwo:** Prosty interfejs z wyraźną walidacją, czytelne komunikaty o błędach, zabezpieczenia przed atakami XSS.

### 2.5. Ekran generowania fiszek przy użyciu AI
- **Główny cel:** Automatyczne generowanie propozycji fiszek na podstawie wprowadzonego tekstu.
- **Kluczowe informacje:** Pole do wklejenia tekstu (wymagane 1000-10000 znaków), lista wygenerowanych propozycji z opcjami akceptacji lub edycji.
- **Kluczowe komponenty:** Duże pole tekstowe, przycisk generowania, wskaźnik ładowania, lista wyników generacji.
- **UX, dostępność i bezpieczeństwo:** Przejrzyste instrukcje, komunikaty o postępie, obsługa błędów API, walidacja długości tekstu.

### 2.6. Ekran historii generacji
- **Główny cel:** Przegląd przeszłych prób generowania fiszek przy użyciu AI.
- **Kluczowe informacje:** Data, czas generacji, liczba propozycji, status ostatniej próby.
- **Kluczowe komponenty:** Lista historii generacji, paginacja, możliwość przeglądania szczegółów poszczególnych prób.
- **UX, dostępność i bezpieczeństwo:** Czytelny timeline, możliwość filtrowania oraz sortowania, dostęp tylko dla zalogowanego użytkownika.

### 2.7. Modal/Okienka błędów i powiadomień
- **Główny cel:** Informowanie użytkownika o błędach, sukcesach i ostrzeżeniach w systemie.
- **Kluczowe informacje:** Treść komunikatu, sugestie naprawy, status operacji.
- **Kluczowe komponenty:** Modale, alerty, powiadomienia toast.
- **UX, dostępność i bezpieczeństwo:** Łatwe zamykanie, możliwość obsługi za pomocą klawiatury, jasne przekazywanie komunikatów bez ujawniania wrażliwych danych.

## 3. Mapa podróży użytkownika

1. Użytkownik otwiera stronę i trafia na ekran logowania/rejestracji.
2. Po poprawnej autoryzacji użytkownik zostaje przekierowany do Dashboardu, gdzie przegląda swoje fiszki.
3. Użytkownik wybiera opcję generowania nowych fiszek przy użyciu AI, co przenosi go do dedykowanego ekranu generacji.
4. Na ekranie generowania użytkownik wkleja tekst, uruchamia proces generacji i oczekuje na wyniki (z widocznym wskaźnikiem ładowania).
5. Po zakończeniu generacji, użytkownik przegląda propozycje fiszek, może je zaakceptować lub edytować.
6. Po zatwierdzeniu, fiszki są zapisywane, a użytkownik wraca na Dashboard, gdzie widzi zaktualizowaną listę.
7. Użytkownik w każdej chwili może przeglądać historię generacji lub zarządzać istniejącymi fiszkami (edytować, usuwać).
8. W razie wystąpienia błędów, system wyświetla odpowiednie komunikaty w modalach lub alertach.

## 4. Struktura nawigacji

- Główna nawigacja umieszczona w nagłówku strony zawiera linki do: Dashboard (Moje fiszki), Generowanie fiszek (AI Generation), Historia generacji oraz Profil/wylogowanie.
- Na urządzeniach mobilnych dostępna jest responsywna nawigacja w formie hamburger menu.
- Każdy widok zawiera elementy nawigacyjne umożliwiające powrót do poprzedniego ekranu lub szybkie przełączenie między sekcjami.
- Wizualne oznaczenie aktywnego widoku zapewnia jasność orientacji w systemie.