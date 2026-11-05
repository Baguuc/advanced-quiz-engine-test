# Zmienne środowiskowe dla wersji podglądowej

## Konfiguracja API
Zmienne środowiskowe konfigurujące backend.

### API_PORT
API_PORT ustawia port na którym będzie działać API.
np. 3000

### API_BASE_URL
API_BASE_URL ustawia bazowy url na którym ma działać API.
np. http://localhost:3000

### AUTH_SECRET
AUTH_SECRET ustawia klucz używany przez API do hashowania.

### APP_URL
APP_URL ustawia url frontendu który należy dodać do polityki CORS w backendzie.
Należy to ustawić na url z jakiego użytkownik bedzie używał aplikacji.
np. http://localhost:5173

## Konfiguracja Frontendu
Zmienne środowiskowe konfigurujące frontend.

### APP_PORT
APP_PORT ustawia port na którym będzie uruchomiona aplikacja frontendu.

## Konfiguracja wspólna
Zmienne środowiskowe konfigurujące backend I frontend.

### AUTH_PATH
AUTH_PATH ustawia ścieżkę na której zapytania przyjmował będzie moduł autoryzacji.
np. /auth

### RPC_PATH
AUTH_PATH ustawia ścieżkę na której zapytania przyjmowało API.
np. /rpc