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
Skopiuj plik .env.example i wypełnij go zgodnie ze [specyfikacją zmiennych](environment.md).

---
## 4. Uruchom bazę danych i serwery.
```
docker compose -f docker-compose.preview.yaml up -d
```
[Więcej komend dockera](docker.md)

---
## 5. Zrób migrację bazy danych.
```
pnpm run db:migrate
```