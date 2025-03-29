# 10xCards

## Opis projektu

10xCards to aplikacja webowa umożliwiająca automatyczne generowanie fiszek przy użyciu sztucznej inteligencji. Celem projektu jest znaczące przyspieszenie i uproszczenie procesu tworzenia fiszek, umożliwiając użytkownikom szybkie przekształcenie wprowadzonego tekstu (kopiuj-wklej) w wysokiej jakości fiszki do nauki.

## Stack technologiczny

### Frontend
- **Astro** (v5.5.5) - Framework do tworzenia szybkich, wydajnych stron
- **React** (v19.0.0) - Biblioteka do budowy interfejsów użytkownika
- **TypeScript** - Język programowania rozszerzający JavaScript
- **Tailwind CSS** (v4.0.17) - Framework CSS

### Narzędzia deweloperskie
- Node.js (v22.14.0 LTS)
- ESLint (v9.23.0)
- Prettier
- Husky & lint-staged


## Jak uruchomić projekt

1. Upewnij się, że masz zainstalowany Node.js w wersji 22.14.0 (LTS)
```bash
nvm use
```

2. Zainstaluj zależności
```bash
npm install
```

3. Uruchom projekt w trybie deweloperskim
```bash
npm run dev
```

## Dostępne skrypty

- `npm run dev` - Uruchomienie projektu w trybie deweloperskim
- `npm run build` - Zbudowanie projektu
- `npm run preview` - Podgląd zbudowanego projektu
- `npm run astro` - Uruchomienie CLI Astro
- `npm run lint` - Sprawdzenie kodu przez ESLint
- `npm run lint:fix` - Automatyczna naprawa problemów znalezionych przez ESLint
- `npm run format` - Formatowanie kodu przy użyciu Prettier

## Scope projektu

### Co wchodzi w zakres
- Wprowadzanie tekstu (kopiuj-wklej)
- Automatyczne generowanie fiszek przy użyciu AI
- Przeglądanie, edycja i zarządzanie fiszkami
- Podstawowy system nauki (sesje powtórkowe)
- System kont użytkowników

### Co nie wchodzi w zakres
- Zaawansowane algorytmy powtórek (np. SuperMemo-2)
- Import wielu formatów (PDF, DOCX, itp.)
- Współdzielenie zestawów fiszek
- Integracje z innymi platformami edukacyjnymi
- Aplikacje mobilne

## Status prac

Projekt jest w początkowej fazie rozwoju, po bootstrapie szkieletu.

## Licencja

MIT