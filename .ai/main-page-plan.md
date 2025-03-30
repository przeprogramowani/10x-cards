# Szczegółowy opis interfejsu "Strona Główna" w 10xCards (z wykorzystaniem Tailwind i shadcn/ui)

Poniżej przedstawiono strukturę i główne elementy "Strony Głównej" w aplikacji 10xCards. Celem tej sekcji jest zaprezentowanie kluczowych funkcjonalności, zachęcenie nowych użytkowników do rejestracji/logowania oraz wyjaśnienie, na czym polega wartość dodana aplikacji.

---

## 1. Nagłówek (Header)

1. **Logo / Nazwa aplikacji**
   - W lewym górnym rogu umieszczone jest logo lub tekstowe oznaczenie "10xCards".
   - Tailwind może posłużyć do ustawienia responsywnego marginesu i odstępów (`py-4 px-6` itp.).
   - Można rozważyć użycie komponentu `navigation-menu` z shadcn/ui do zbudowania całego nagłówka, choć dla prostej strony głównej wystarczy klasyczny div z przyciskami.

2. **Przyciski nawigacyjne**
   - W prawym górnym rogu najważniejsze linki:
     - [**Zaloguj się**]
     - [**Zarejestruj się**]
   - Do przycisków można wykorzystać `button` z shadcn/ui, np. wariant `outline` lub `default`.
   - Dodatkowe linki, np. do dokumentacji, można zamieścić w poziomym menu obok przycisków.

**Kluczowe cele nagłówka**:
- Zapewnienie szybkiej nawigacji do logowania i rejestracji.
- Budowanie świadomości marki (logo / nazwa "10xCards").

---

## 2. Sekcja bohatera (Hero Section)

1. **Krótki opis 10xCards**
   - Centralny punkt strony z nagłówkiem w stylu "Automatyczne generowanie fiszek w kilka sekund" lub podobnym hasłem oddającym główną wartość aplikacji.
   - Można użyć komponentu `card` z shadcn/ui do wyeksponowania krótkiego opisu oraz przycisku CTA (Call To Action).
   - Za pomocą Tailwind można zadbać o czytelne marginesy (`mx-auto`, `my-8`), dopasowanie szerokości tekstu (`max-w-2xl`) i wyśrodkowanie treści (`text-center`).

2. **Przycisk CTA**
   - "Wypróbuj za darmo" lub "Rozpocznij naukę już teraz" → zachęca do szybkiego przejścia do rejestracji bądź generowania fiszek.
   - Opcjonalnie do stylizacji można wykorzystać wariant `secondary` z `button`.
   - Powinien prowadzić do `/register` lub innej dedykowanej sekcji zachęcającej do założenia konta.

3. **Tło / Ilustracje**
   - Tło może zawierać grafikę symbolizującą naukę lub tworzenie fiszek.
   - Przy użyciu Tailwind można łatwo ustawić sekcję pełnoekranową (`min-h-screen`) i wycentrować całość zawartości.

**Kluczowe cele sekcji**:
- Przekazanie wartości aplikacji w prosty i atrakcyjny sposób.
- Skierowanie użytkownika do podstawowych akcji (rejestracja / logowanie).

---

## 3. Prezentacja kluczowych funkcji (Features)

1. **Lista korzyści**
   - Można przedstawić 2–4 główne zalety, np.:
     - Automatyczne generowanie fiszek z tekstu.
     - Oszczędność czasu dzięki AI.
     - Prosty system zarządzania i edycji fiszek.
     - Sesje nauki ułatwiające zapamiętywanie.
   - Każdy z punktów można zaprezentować w formie kart (`card`) z krótkim opisem i ewentualną ikoną, np. z biblioteki `lucide-react`.
   - Można użyć Tailwind do rozmieszczenia kart w rzędach / kolumnach (`grid grid-cols-1 md:grid-cols-2` itp.).

2. **Wygląd i styl**
   - Dzięki Tailwind można utrzymać spójną kolorystykę (np. kolory z motywu: `bg-white`, `text-gray-900` w trybie jasnym lub `bg-gray-950`, `text-gray-50` w trybie ciemnym).
   - Elementy są wyraźnie oddzielone marginesami (`mt-4`, `mb-8`) i otoczone białą przestrzenią do podkreślenia ważności.

**Kluczowy cel sekcji**:
- Podkreślenie unikalnych cech aplikacji i pokazanie użytkownikowi, co może zyskać.

---

## 4. Sekcja "Jak to działa?" (How It Works)

1. **Krótka instrukcja w krokach**
   - Przedstawienie procesu tworzenia fiszek za pomocą AI:
     1. Wklejenie tekstu do generatora.
     2. Analiza tekstu przez AI.
     3. Generowanie fiszek i przegląd/edycja.
     4. Zatwierdzanie i zapis do konta.
   - Można zastosować `accordion` do wyświetlenia kolejnych kroków, aby nie przytłaczać użytkownika liczbą informacji. Każdy krok może być rozwijany w osobnej sekcji.

2. **Elementy wizualne**
   - Ikony (np. `Clipboard`, `Wand`, `Cards`, `CheckCircle`) pomagają zobrazować logikę każdego kroku.
   - Stylizacja akordeonu z użyciem Tailwind (np. `border`, `rounded-md`, `shadow-sm`) pozwoli zachować porządek i estetykę.

**Kluczowy cel sekcji**:
- Ułatwienie zrozumienia procesu generowania i obsługi fiszek.

---

## 5. Stopka (Footer)

1. **Linki pomocnicze**
   - Kontakt, Polityka prywatności, Regulamin.
   - Można użyć prostego układu na siatce (np. `grid grid-cols-2 md:grid-cols-4`) lub kilku kolumnach obok siebie.

2. **Informacje o prawach autorskich**
   - Tekst w stylu "© 2025 10xCards. Wszelkie prawa zastrzeżone."
   - Ustawienie stylu i odstępów (np. `py-4 text-center text-sm text-gray-500` przy użyciu Tailwind).

**Kluczowe cele stopki**:
- Zapewnienie linków do treści istotnych prawnie i informacyjnie (np. "Polityka prywatności", "Regulamin").
- Zamknięcie strony w sposób przejrzysty i schludny.

---

## Podsumowanie

Strona Główna 10xCards powinna w przystępny sposób komunikować wartości aplikacji i zachęcać do rejestracji. W projekcie można bazować na komponentach Shadcn/UI (np. `button`, `card`, `accordion`) oraz korzystać z wygodnych klas Tailwind do szybkiego prototypowania i spójnego stylizowania. Efektem będzie minimalistyczna, ale czytelna i nowocześnie wyglądająca strona główna, prowadząca użytkownika do kluczowych akcji: rejestracji, logowania oraz zapoznania się z główną zaletą aplikacji — automatycznym generowaniem fiszek z dowolnego tekstu.