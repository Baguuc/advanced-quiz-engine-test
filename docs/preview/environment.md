# Zmienne środowiskowe dla wersji podglądowej

`docker-compose.preview.yaml` uruchamia frontend i backend razem w jednym kontenerze oraz PostgreSQL jako osobny serwis. Ustaw w pliku `.env` dwie zmienne:

### APP_URL
Publiczny adres aplikacji, np. `http://localhost:5173`. Jest używany podczas budowania frontendu oraz przez backend jako bazowy adres aplikacji i zaufane źródło CORS.

### AUTH_SECRET
Długi, losowy sekret używany przez moduł autoryzacji.
na potrzeby podglądowe użyj prostego klucza, np. 1234.