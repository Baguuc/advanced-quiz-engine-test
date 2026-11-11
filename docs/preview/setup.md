# Przygotowywanie projektu

---
## 1. Sklonuj repo.
```
git clone https://github.com/Vtraxio/advanced-quiz-engine.git
cd advanced-quiz-engine
```

Wjedź na branch "staging", jest to najnowsza wersja deweloperska na repo.
```
git checkout staging
```

---
## 2. Zainstaluj zależności.
```
pnpm install
```

---
## 3. Wprowadź zmienne środowiskowe.
Skopiuj plik .env.example, zmień jego nazwę na .env i wypełnij go zgodnie ze [specyfikacją zmiennych](environment.md).

---
## 4. Uruchom bazę danych i kontenery.
```
docker compose -f docker-compose.preview.yaml up -d
```

---
## 5. Zmigruj bazę danych.
W folderze apps/backend stwórz plik .env i dodaj do niego poniższą treść:
```
DATABASE_URL="postgresql://dev:dev@localhost:5432/quiz-engine"
```

Później uruchom komendę
```
pnpm run db:migrate
```