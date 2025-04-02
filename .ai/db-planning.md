<conversation_summary>
<decisions>
1. Tekst źródłowy nie będzie przechowywany w bazie ze względu na prawa autorskie.
2. Nie przechowujemy propozycji fiszek AI w bazie – jedynie je wyświetlamy użytkownikowi.
3. Zarządzanie użytkownikami (rejestracja, logowanie, hasła) pozostaje w gestii Supabase.
4. Tworzymy tabelę „generations” z: timestamp, rodzajem modelu AI, liczbą wygenerowanych propozycji, długością tekstu źródłowego, hashem tekstu, czasem generowania, user_id, liczbą fiszek zaakceptowanych bez edycji i z edycją.
5. Zachowujemy relację 1:N pomiędzy użytkownikami a fiszkami, bez współdzielenia fiszek między użytkownikami.
6. Obecnie nie śledzimy szczegółowych statystyk wyświetleń czy edycji pojedyńczych fiszek.
7. Skupiamy się wyłącznie na darmowych użytkownikach bez dodatkowych ról.
8. Edycja fiszek odbywa się in-place, bez wersjonowania.
9. Ustalamy limit znaków 200 dla pytania i 500 dla odpowiedzi w tabeli „cards”.
10. Potrzebujemy tabeli „generation_error_logs” z danymi: timestamp, model AI, liczba wygenerowanych propozycji, długość tekstu źródłowego, hash tekstu, czas generowania, user_id, kod błędu i komunikat błędu.
</decisions>

<matched_recommendations>
1. Zastosowanie mechanizmu RLS w tabelach powiązanych z danymi użytkowników („cards”, „generations”, „generation_error_logs”).
2. Rozdzielenie zapisów generacji i błędów w osobnych tabelach („generations” i „generation_error_logs”) dla przejrzystości oraz łatwiejszego audytu.
3. Użycie indeksów (np. na polu timestamp i user_id) w tabelach „generations” i „generation_error_logs” w celu optymalizacji zapytań.
4. Wprowadzenie constraintów w tabeli „cards” w bazie danych, narzucających limity znaków (200 dla front, 500 dla back).
5. Dodanie kolumny typu `source` (manual, ai-full, ai-edited) w tabelach „cards”.
6. Korzystanie z domyślnych wartości timestamp (`DEFAULT NOW()`) w celu automatycznego zapisywania czasu zdarzenia w „generations” i „generation_error_logs”.
</matched_recommendations>

<database_planning_summary>
W planowanej bazie danych przewidujemy kilka kluczowych tabel:
• „users” – zarządzana przez Supabase, odpowiedzialna za przechowywanie informacji o użytkownikach (m.in. identyfikator, adres e-mail, hasło).
• „cards” – zawierają pytania i odpowiedzi (odpowiednio do 200 i 500 znaków), powiązane kluczem obcym z „users” (relacja 1:N). Zawiera także pole `source` określające, czy fiszka pochodzi z manualnego wpisu czy generacji AI (w całości lub edytowana).
• „generations” – przechowuje informacje o pojedynczej akcji generowania (timestamp, rodzaj modelu AI, liczba wygenerowanych propozycji, długość i hash tekstu, czas generowania, user_id). Dodatkowe kolumny odpowiadają za liczbę fiszek zaakceptowanych z i bez edycji.
• „generation_error_logs” – utrzymuje dane o błędach związanych z generowaniem (podobne pola do „generations”, plus kod i komunikat błędu).

Mechanizmy bezpieczeństwa obejmują włączenie RLS we wszystkich tabelach powiązanych z danymi użytkownika, wraz z wymuszeniem klucza obcego do „users”. Dzięki temu każdy użytkownik ma dostęp wyłącznie do własnych rekordów. Skalowalność zapewni wprowadzenie indeksów w kluczowych kolumnach (np. `timestamp`, `user_id`).

Cały projekt zakłada brak przechowywania oryginalnego tekstu źródłowego lub niewykorzystanych propozycji. Zamiast tego, dane pozwolą na analizę statystyczną i debugging w ramach twoch głównych tabel: „generations” i „generation_error_logs”. Rozbudowane wersjonowanie czy advanced log rotation nie jest wymagane w tym MVP, choć pozostaje opcją do rozważenia w przyszłości.
</database_planning_summary>

<unresolved_issues>
Obecnie nie zdefiniowano konkretnego podejścia do archiwizacji/długoterminowej retencji logów, co można rozważyć przy dalszym skalowaniu aplikacji.
</unresolved_issues>
</conversation_summary>