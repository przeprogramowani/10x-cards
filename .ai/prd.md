# Project Requirements Document (PRD) for 10xCards

## Zwięzły opis projektu i jego celów - Co budujemy i po co?

10xCards to aplikacja webowa umożliwiająca automatyczne generowanie fiszek przy użyciu sztucznej inteligencji. Celem projektu jest znaczące przyspieszenie i uproszczenie procesu tworzenia fiszek, umożliwiając użytkownikom szybkie przekształcenie wprowadzonego tekstu (kopiuj-wklej) w wysokiej jakości fiszki do nauki.

---

## Jasno zdefiniowany problem użytkownika - Jaki ból rozwiązujemy?

Użytkownicy tradycyjnych metod nauki muszą ręcznie tworzyć fiszki, co jest czasochłonne, żmudne i wymaga dużego nakładu pracy przy analizie materiału, wyciąganiu kluczowych informacji oraz formułowaniu pytań i odpowiedzi. Ten proces stanowi barierę wejścia i zniechęca do korzystania z efektywnej metody nauki, jaką jest nauka z fiszek.

---

## Wymagania funkcjonalne - Co dokładnie musi robić nasz produkt?

- Umożliwić użytkownikowi wprowadzenie tekstu (kopiuj-wklej).
- Automatycznie generować fiszki przy użyciu AI na podstawie wprowadzonego tekstu.
- Umożliwić przeglądanie, edycję i zarządzanie wygenerowanymi fiszkami.
- Zapewnić podstawowy system nauki z wykorzystaniem wygenerowanych fiszek (sesje powtórkowe).
- Udostępnić prosty system kont użytkowników do bezpiecznego przechowywania fiszek.

---

## Granice projektu - Co wyraźnie NIE wchodzi w zakres?

- Zaawansowane algorytmy powtórek, takie jak SuperMemo-2.
- Import wielu formatów (PDF, DOCX, itp.); tylko tekst wklejany (kopiuj-wklej) jest wspierany.
- Współdzielenie zestawów fiszek między użytkownikami.
- Integracje z innymi platformami edukacyjnymi.
- Aplikacje mobilne; w początkowej wersji dostępna będzie jedynie wersja web.

---

## Precyzyjne user stories - Jak użytkownicy będą korzystać z naszego rozwiązania?

US-001: Wprowadzanie tekstu do generowania fiszek
Title: Wprowadzanie tekstu
Description: Jako użytkownik chcę móc wprowadzić lub wkleić tekst, aby na jego podstawie wygenerować fiszki.
Acceptance Criteria:

- Pole tekstowe akceptuje od 1000 do 10 000 znaków.
- Wprowadzony tekst jest przetwarzany w celu generowania fiszek zawierających pola "front" i "back" oraz metadane łączące fiszkę z kontem użytkownika.
- System weryfikuje, czy tekst został wprowadzony przed rozpoczęciem generowania fiszek.

US-002: Automatyczne generowanie fiszek
Title: Generowanie fiszek
Description: Jako użytkownik chcę, aby system automatycznie generował fiszki przy użyciu AI na podstawie wprowadzonego tekstu, aby szybko otrzymać materiały do nauki.
Acceptance Criteria:

- Po przesłaniu tekstu generowane jest co najmniej 20 fiszek w czasie krótszym niż 5 minut.
- Przynajmniej 80% wygenerowanych fiszek zawiera poprawne pytania i odpowiedzi bez potrzeby edycji.
- Proces generowania odbywa się synchronicznie.
- System zapisuje szczegółowe informacje o procesie generowania: status wykonania, długość inputu, liczba wygenerowanych fiszek, czas odpowiedzi, opcjonalny komunikat błędu, oraz timestamp.
- W przypadku niewystarczającej ilości tekstu wyświetlany jest odpowiedni komunikat o błędzie.

US-003: Przeglądanie wygenerowanych fiszek
Title: Przegląd fiszek
Description: Jako użytkownik chcę móc przeglądać listę wygenerowanych fiszek, aby ocenić ich jakość i przydatność.
Acceptance Criteria:

- Lista fiszek wyświetla pytania i odpowiedzi w czytelny sposób.
- Użytkownik ma możliwość sortowania lub filtrowania fiszek według wybranych kryteriów (np. czasu generowania).

US-004: Edycja fiszek
Title: Edycja treści fiszek
Description: Jako użytkownik chcę mieć możliwość edytowania fiszek, aby poprawić ewentualne błędy lub dostosować treść do moich potrzeb.
Acceptance Criteria:

- Każda fiszka posiada opcję edycji umożliwiającą modyfikację pytania i odpowiedzi.
- Zmiany są zapisywane i natychmiast widoczne w widoku listy fiszek.

US-005: Usuwanie fiszek
Title: Usuwanie fiszek
Description: Jako użytkownik chcę móc usuwać fiszki, które nie są mi potrzebne, w celu utrzymania uporządkowanego zbioru.
Acceptance Criteria:

- Każda fiszka ma opcję usunięcia.
- Przed usunięciem wyświetlany jest komunikat potwierdzający akcję usunięcia.

US-006: Podstawowy system nauki
Title: Sesja nauki
Description: Jako użytkownik chcę rozpocząć sesję nauki z wykorzystaniem fiszek, aby efektywnie przyswajać wiedzę.
Acceptance Criteria:

- System umożliwia uruchomienie sesji, w której fiszki są prezentowane pojedynczo.
- Użytkownik może oznaczać fiszki jako zapamiętane lub wymagające powtórki.
- Postęp sesji jest monitorowany, a wyniki są wyświetlane po jej zakończeniu.

US-007: Uwierzytelnianie i zarządzanie kontem
Title: Bezpieczny dostęp do konta
Description: Jako użytkownik chcę móc zarejestrować się i zalogować do systemu, aby moje fiszki były przechowywane w sposób bezpieczny i były dostępne w przyszłości.
Acceptance Criteria:

- System umożliwia rejestrację, logowanie i wylogowywanie.
- Hasła są przechowywane w sposób bezpieczny (np. szyfrowane).
- W przypadku podania nieprawidłowych danych, wyświetlany jest odpowiedni komunikat o błędzie.

US-008: Zatwierdzanie wygenerowanych fiszek
Title: Weryfikacja i zatwierdzanie fiszek
Description: Jako użytkownik chcę mieć możliwość zatwierdzania wygenerowanych fiszek przed ich dodaniem do talii, aby upewnić się, że tylko wysokiej jakości fiszki są zapisywane.
Acceptance Criteria:

- System wyświetla wygenerowane fiszki w podglądzie przed finalnym dodaniem do talii.
- Użytkownik ma możliwość edycji zawartości fiszki przed jej zatwierdzeniem.
- Tylko zatwierdzone fiszki są zapisywane i dodawane do talii (w bazie danych nie przechowujemy statusu, a jedynie finalnie zatwierdzone fiszki).
- Użytkownik otrzymuje potwierdzenie zatwierdzenia lub odrzucenia fiszki.

---

## Metryki sukcesu - Jak zmierzymy, czy nasze rozwiązanie działa?

- Użytkownik jest w stanie wygenerować co najmniej 20 fiszek w czasie krótszym niż 5 minut.
- Minimum 80% wygenerowanych fiszek jest użytecznych bez konieczności wprowadzania poprawek.
- Opinie użytkowników wskazują, że proces tworzenia fiszek jest co najmniej 3 razy szybszy w porównaniu do tradycyjnych metod.

## Wymagania techniczne i bezpieczeństwo

- Endpointy REST API (/api) muszą być chronione przez Supabase JWT.
- W początkowej wersji systemu zastosujemy uproszczony mechanizm uwierzytelniania poprzez jednego użytkownika hardcoded, który zostanie później zastąpiony pełnym systemem autoryzacji.
