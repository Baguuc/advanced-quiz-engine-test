# Przygotowywanie projektu

---
## 1. Sklonuj repo.
```
git clone https://github.com/Vtraxio/advanced-quiz-engine.git
cd advanced-quiz-engine
```

Wjedź na swój wyznaczony branch do tego, co chcesz robić.
Najbardziej aktualna wersja deweloperska jest na branchu `staging`.
```
git checkout staging
```

---
## 2. Zainstaluj zależności.
```
pnpm install
```
---
## 3. Uruchom bazę danych.
```
docker compose up -d
```
[Więcej komend dockera](docker.md)

---
## 4. Wprowadź zmienne środowiskowe.

W folderach `/apps/backend` i `/apps/frontend` skopiuj istniejące w nich pliki `.env.example` i zmień ich nazwy na `.env`.
Wypełnij je zgodnie z opisami z [dokumentacji zmiennych środowiskowych](environment.md).

---
## 5. Zrób migrację bazy danych.
```
pnpm run db:migrate
```

---
## 6. Uruchom serwer.
```
pnpm run dev
```