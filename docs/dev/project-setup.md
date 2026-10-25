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

W folderze `/apps/backend` skopiuj plik `.env.example` i zmień jego nazwę na `.env`.
Wypełnij go zgodnie z [instrukcją](environment.md).

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