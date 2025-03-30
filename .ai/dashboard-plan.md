# Plan Interfejsu - Panel Użytkownika (Dashboard)

## 1. Struktura Główna

1. **Nagłówek (Header)**
   - Logo / nazwa aplikacji (np. "10xCards")
   - Ewentualny link (lub ikonka) do wylogowania się

2. **Menu Nawigacyjne (górne)**
   - Pozycje menu (w jednakowym priorytecie):
     1. [Generowanie Fiszek (AI)](/dashboard/generate)
     2. [Lista Fiszek](/dashboard/cards)
     3. [Sesje Nauki](/dashboard/study)
     4. [Ustawienia Konta](/dashboard/settings)
   - Ponieważ wszystkie funkcje mają jednakowy priorytet, zastosuj listę równorzędną listę w poziomym menu.

3. **Obszar główny (Main Content Area)**
   - W widoku "Panel użytkownika" (strona domyślna po zalogowaniu) zaprezentuj ogólne informacje, które pomogą użytkownikowi zorientować się w zawartości jego konta.
   - **Wersja tekstowa i liczbowa** prezentacji najważniejszych danych:
     - *Lista kolekcji fiszek*:
       - Nazwa każdej kolekcji
       - Liczba fiszek w kolekcji

## 2. Sekcja Podsumowania Fiszek (Dashboard Overview)

1. **Tytuł sekcji**: np. „Przegląd Twoich Kolekcji"
2. **Lista kolekcji** (np. w formie tabeli lub kart):
   - **Nazwa kolekcji** – w formie linku, który prowadzi do szczegółowego widoku danej kolekcji (np. `/dashboard/cards/collectionId`).
   - **Liczba fiszek** – liczba fiszek w danej kolekcji w nawiasie. Jeśli kolekcja jest pusta, wyświetl np. „(0 fiszek)".
   - Wprowadź obsługę stronicowania (pagination) do obsługi dużej liczby kolekcji. Jedna strona powinna zawierać maksymalnie 10 kolekcji.

3. **Opcja tworzenia nowej kolekcji**
   - Przycisk „Nowa kolekcja" otwierający modal do strony tworzenia kolekcji (nazwa kolekcji, przycisk do zapisania).

## 3. Menu Nawigacyjne w Szczegółach

Poniżej przedstawiono przykładowy układ i zachowanie poszczególnych elementów menu:

1. **Generowanie Fiszek (AI)**
   - Przekierowanie do widoku `dashboard/generate`, w którym użytkownik będzie mógł wkleić tekst i uruchomić moduł AI.
   - Przycisk „Generuj" dostępny tylko w tym widoku.

2. **Lista Fiszek**
   - Przekierowanie do widoku `dashboard/cards`, w którym użytkownik będzie mógł przeglądać wszystkie istniejące fiszki i filtrować je za pomocą kolekcji fiszek.
   - Daje możliwość bezpośredniego przejścia do edycji fiszki bądź jej usunięcia.

3. **Sesje Nauki**
   - Przekierowanie do trybu nauki (flashcards mode).
   - Opcja oznaczenia fiszek jako „Zapamiętane" lub „Do powtórki".

4. **Ustawienia Konta**
   - Formularz do ustawienia klucza API dla OpenRouter (wymagany do generowania fiszek za pomocą AI).
   - Link lub przycisk do wylogowania.

## 4. Układ Ekranu i Elementy Interaktywne

1. **Nagłówek**:
   - W górnej części, z krótkim powitaniem użytkownika, np. „Witaj, [Imię Użytkownika]".
   - Zawiera przycisk „Wyloguj się" z przekierowaniem do strony głównej.

2. **Panel górny**:
   - Lista linków do poszczególnych sekcji (opisanych wyżej).
   - Element aktywny (np. „Lista Fiszek") powinien być wyróżniony (pogrubienie, kolor).
   - Wszystkie linki w menu powinny mieć wyraźną etykietę tekstową (ważne dla dostępności).

3. **Główna zawartość**:
   - **Sekcja Podsumowania**:
     - Tytuł (np. „Twoje Kolekcje Fiszek").
     - Lista kolekcji z nazewnictwem i liczbą fiszek, posortowana np. alfabetycznie lub według czasu utworzenia.
     - Możliwość kliknięcia na nazwę kolekcji i przejścia do jej szczegółów.
     - Przy liczbie kolekcji przekraczającej 10– paginacja.
   - **Przycisk akcji**: wyświetl przycisk „+ Nowa kolekcja" (lub podobny) w górnej nawigacji sekcji.

## 5. Wytyczne WCAG AA

Aby spełnić wymogi WCAG AA, zwróć uwagę na następujące aspekty:

- **Kontrast kolorów**:
  - Upewnij się, że stosunek kontrastu między tekstem a tłem wynosi co najmniej 4.5:1 dla tekstu o normalnej wielkości.
- **Nawigacja przy użyciu klawiatury**:
  - Wszystkie elementy interaktywne (przyciski, linki) muszą być możliwe do obsłużenia za pomocą klawiatury (focus states, skip links itp.).
  - Dodaj wyraźny styl focusa (np. obramowanie lub podświetlenie) na elementach, aby użytkownicy korzystający z klawiatury wiedzieli, gdzie aktualnie znajduje się fokus.
- **Teksty alternatywne**:
  - Wszystkie grafiki, ikony, logo muszą mieć atrybut `alt` opisujący ich funkcję lub zawartość.

## 6. Działania Poza Zakresem (dla kontekstu)

- **Powiadomienia**: W pierwszej fazie brak obsługi powiadomień.
- **Zaawansowana personalizacja**: Użytkownik nie będzie mógł dostosowywać widoku Panelu.
- **Inne funkcje**: Brak dodatkowych (np. eksport, import), skupiamy się na MVP.

## 7. Podsumowanie

W zaproponowanym widoku Panelu użytkownika wyeksponowano:
1. **Czytelną listę kolekcji** z liczbą fiszek – pozwala to użytkownikowi szybko zorientować się w zawartości jego konta.
2. **Rutynowy dostęp** do najważniejszych funkcji aplikacji poprzez stałe menu nawigacyjne.
3. **Prostą formę przeglądu** w głównym obszarze ekranu, bez zbędnego obciążenia dodatkowymi panelami i wskaźnikami, co odpowiada wskazanym wymaganiom MVP.
4. **Wymogi WCAG AA** zapewnione przez zachowanie odpowiedniego kontrastu, obsługę klawiatury i etykiety atrybutów ułatwiające korzystanie osobom ze szczególnymi potrzebami.
