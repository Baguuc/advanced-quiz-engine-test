# Zmienne środowiskowe dla projektu frontendu
Frontend używa zmiennych środowiskowych aby konfigurować ważne dane konfiguracyjne (np. url api).
Każda zmienna środowiskowa frontendu zaczyna się od "VITE_".
Zmienne środowiskowe są wklejane statycznie do skryptów podczas budowania projektu.

W głównym obrazie aplikacji frontend jest budowany z `VITE_API_URL` ustawionym na `APP_URL`, `VITE_RPC_PATH` na `rpc` i `VITE_AUTH_PATH` na `/auth`. Klient dodaje początkowy ukośnik do ścieżki RPC, więc zapytania trafiają pod `/rpc`. Frontend i API korzystają wtedy z tego samego publicznego adresu.

### VITE_API_URL
VITE_API_URL ustawia url bazowy url kierujący do api (backendu). Jest on użyty jako baza do wszystkich endpointów.
Endpoint RPC and Auth będą miały wklejony ten url jako baze.
np. https://api.example.com

### VITE_RPC_PATH
VITE_RPC_PATH służy do ustawienia bazowego endpointu do wysyłania zapytań protokołem RPC.
np. /rpc

### VITE_AUTH_PATH
VITE_AUTH_PATH służy do ustawienia bazowego endpointu do wysyłania zapytań do better auth (biblioteki której używa backend).
np. /auth