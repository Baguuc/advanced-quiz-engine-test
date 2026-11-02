# Zmienne środowiskowe dla projektu frontendu
Frontend używa zmiennych środowiskowych aby konfigurować ważne dane konfiguracyjne (np. url api).
Każda zmienna środowiskowa frontendu zaczyna się od "VITE_".
Zmienne środowiskowe są wklejane statycznie do skryptów podczas budowania projektu.

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