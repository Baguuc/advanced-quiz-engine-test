# Zmienne środowiskowe dla projektu backendu
Backend używa zmiennych środowiskowych aby konfigurować ważne dane konfiguracyjne (np. url bazy danych, sciezki api itd).

## Połączony obraz aplikacji
Główny `Dockerfile` uruchamia backend i frontend razem. Przy budowaniu obrazu ustaw argument `APP_URL` na publiczny adres aplikacji. Przy uruchomieniu kontenera wymagane są tylko:
- `APP_URL` — publiczny adres aplikacji; ustawiany jako `APP_BASE_URL` i `CORS_TRUSTED_ORIGIN`.
- `AUTH_SECRET` — ustawiany jako `BETTER_AUTH_SECRET`.
- `DATABASE_URL` — adres połączenia z bazą danych.

Obraz ustawia `APP_PORT=3000`, `BETTER_AUTH_PATH=/auth` i `ORPC_PATH=/rpc`. Podczas budowania `APP_URL` jest przekazywany jako argument budowania i używany przez frontend jako `VITE_API_URL`; `VITE_RPC_PATH` ma wartość `rpc` (klient dodaje początkowy `/`), a `VITE_AUTH_PATH` — `/auth`.

### APP_PORT
APP_PORT ustawia port na jakim bedzie dzialac aplikacja.
np. 3000

### APP_BASE_URL
APP_BASE_URL ustawia bazowy url aplikacji np. do better auth.
np. http://localhost:3000

### CORS_TRUSTED_ORIGIN
Ta zmienna ustawia zaufane zrodlo zapytan. Wymagane przez cors.
np. http://localhost:5173

### DATABASE_URL
Ustawia url do połączenia z bazą danych.
np. postgres://user:password@localhost:5432/dbname

### BETTER_AUTH_SECRET
Ustawia klucz hashowania użyty do autoryzacji.
np. W7Ou90ehWsEkTpRlNM2gNJVswhUr3tWA

### BETTER_AUTH_PATH
Ustawia scieżke (po bazowym url) na której będzie działać moduł autoryzacji.
'/' wstawiony na początek będzie usunięty.
np. /auth, auth, /betterauth

### ORPC_PATH
Ustawia scieżke (po bazowym url) na której będzie działać moduł całego api (rpc).
'/' wstawiony na początek będzie usunięty.
np. /rpc, orpc, /orpc

### SOCIAL_ROBLOX_CLIENT_ID
Id aplikacji OAuth do logowania przez Roblox.

### SOCIAL_ROBLOX_CLIENT_SECRET
Klucz aplikacji OAuth do logowanie przez Roblox.

### SOCIAL_GITHUB_CLIENT_ID
Id aplikacji OAuth do logowania przez Github.

### SOCIAL_GITHUB_CLIENT_SECRET
Klucz aplikacji OAuth do logowanie przez Github.