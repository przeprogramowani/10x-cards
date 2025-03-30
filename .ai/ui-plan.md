# Architektura interfejsu użytkownika 10xCards

## Proponowana architektura interfejsu użytkownika

Poniżej przedstawiono uproszczoną mapę aplikacji 10xCards, uwzględniającą główne strony, ich hierarchię oraz wzajemne połączenia. Struktura jest oparta na wymaganiach z dokumentacji [@prd.md](#) i korzysta z wybranego stosu technologicznego [@tech-stack.md](#).

---

### 1. Strona główna (Landing Page)
- **Opis**: Strona prezentująca ogólny zarys aplikacji, jej funkcjonalności i zalety.
- **Elementy kluczowe**:
  - Krótki opis 10xCards i korzyści z korzystania
  - Przycisk "Zarejestruj się" / "Zaloguj się"
  - Link do dokumentacji lub sekcji "Jak to działa?"

**Ścieżki nawigacji**:
- [Zaloguj się] → prowadzi do strony logowania
- [Zarejestruj się] → prowadzi do strony rejestracji
- [Dowiedz się więcej / Dokumentacja] → może prowadzić do dodatkowych zasobów lub np. strony FAQ

---

### 2. Rejestracja (Register)
- **Ścieżka**: `/register`
- **Opis**: Formularz do stworzenia nowego konta użytkownika
- **Elementy kluczowe**:
  - Pola do podania danych (e-mail, hasło, potwierdzenie hasła)
  - Walidacja poprawności danych
  - Przekierowanie do strony logowania po zakończeniu rejestracji

---

### 3. Logowanie (Login)
- **Ścieżka**: `/login`
- **Opis**: Formularz logowania dla istniejących użytkowników
- **Elementy kluczowe**:
  - Pola e-mail i hasło
  - Walidacja (np. komunikat o błędzie w razie nieprawidłowych danych)
  - Link lub przycisk do strony rejestracji (dla nowych użytkowników)

---

### 4. Panel użytkownika (Dashboard)
- **Ścieżka**: `/dashboard` (dostępne po zalogowaniu)
- **Opis**: Główna strona do zarządzania fiszkami oraz do korzystania z funkcji generowania AI
- **Elementy kluczowe**:
  - Podsumowanie stanu konta / powiadomienia
  - Menu nawigacyjne do poszczególnych sekcji:
    1. **Generowanie fiszek (AI)**
    2. **Lista / zarządzanie fiszkami**
    3. **Sesje nauki**
    4. **Ustawienia konta**

---

### 4.1. Generowanie fiszek (AI)
- **Ścieżka**: `/dashboard/generate`
- **Opis**: Miejsce na wklejenie tekstu oraz uruchomienie modułu AI w celu wygenerowania zestawu fiszek
- **Elementy kluczowe**:
  - Pole tekstowe na co najmniej 1000 znaków
  - Przycisk "Generuj" uruchamiający proces tworzenia fiszek przez AI
  - Obsługa błędów (np. brak tekstu, za krótki tekst)
  - Podgląd wygenerowanych fiszek, przyciski do zatwierdzania / odrzucania przed finalnym zapisaniem

---

### 4.2. Lista fiszek
- **Ścieżka**: `/dashboard/cards`
- **Opis**: Strona wyświetlająca wszystkie wygenerowane i zapisane fiszki. Umożliwia przeglądanie i edycję.
- **Elementy kluczowe**:
  - Sortowanie, filtrowanie (np. czas dodania)
  - Przyciski akcji przy każdej fiszce: [Edytuj], [Usuń]
  - Przycisk "Dodaj nowe" (np. ręczne dodanie pojedynczej fiszki)

---

### 4.3. Edycja fiszek
- **Ścieżka**: `/dashboard/cards/edit/:id`
- **Opis**: Formularz do edytowania pytań i odpowiedzi w obrębie wybranej fiszki
- **Elementy kluczowe**:
  - Pole "Pytanie"
  - Pole "Odpowiedź"
  - Zapisanie zmian i przekierowanie do listy fiszek

---

### 4.4. Sesja nauki
- **Ścieżka**: `/dashboard/study`
- **Opis**: Tryb przeglądania fiszek w celu efektywnego zapamiętania treści (flashcard mode)
- **Elementy kluczowe**:
  - Prezentacja pojedynczej fiszki (pytanie → przycisk "Odkryj odpowiedź" → odpowiedź)
  - Zaznaczenie, czy fiszka została opanowana, czy wymaga powtórki
  - Monitorowanie postępu (np. licznik przerobionych fiszek)

---

### 4.5. Ustawienia konta
- **Ścieżka**: `/dashboard/settings`
- **Opis**: Zarządzanie danymi konta i opcjami personalizacji
- **Elementy kluczowe**:
  - Zmiana hasła (z obsługą bezpiecznej weryfikacji)
  - Edycja danych użytkownika (np. nazwa, e-mail)
  - Opcja wylogowania się

---

### 5. Wylogowanie (Logout)
- **Ścieżka**: `/logout` (lub przycisk w panelu)
- **Opis**: Bezpieczne zakończenie sesji i przekierowanie do strony głównej lub logowania

---

## Schemat nawigacji (przykładowy diagram)

```
[ Strona Główna ]
   | Zaloguj / Zarejestruj
   v
[ Login ] ----> [ Register ]
   |           (po rejestracji powrót do Login)
   v
[ Dashboard ]
   |
   |----> [ Generate Cards (AI) ]
   |
   |----> [ Card List ]
   |       |---> [ Edit Card ]
   |
   |----> [ Study Sessions ]
   |
   |----> [ Settings ]
   |
   |----> [ Logout ]
```

---

## Podsumowanie

Przedstawiona architektura interfejsu użytkownika uwzględnia główne potrzeby opisane w [@prd.md](#). Konstrukcja opiera się na wyraźnym podziale aplikacji na strony odpowiadające najważniejszym funkcjonalnościom: rejestracji, logowaniu, generowaniu fiszek, zarządzaniu nimi, nauce oraz zarządzaniu ustawieniami konta. Nawigacja jest zaplanowana w sposób czytelny, aby użytkownik mógł szybko znaleźć interesującą go funkcję i efektywnie tworzyć oraz przeglądać swoje fiszki.