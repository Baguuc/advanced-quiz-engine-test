# Zmienne środowiskowe dla projektu backendu
Backend używa zmiennych środowiskowych aby konfigurować ważne dane konfiguracyjne (np. url bazy danych, sciezki api itd).

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
np. aksldjij21ijsdfa

### BETTER_AUTH_PATH
Ustawia scieżke (po bazowym url) na której będzie działać moduł autoryzacji.
'/' wstawiony na początek będzie usunięty.
np. /auth, auth, /betterauth

### ORPC_PATH
Ustawia scieżke (po bazowym url) na której będzie działać moduł całego api (rpc).
'/' wstawiony na początek będzie usunięty.
np. /rpc, orpc, /orpc