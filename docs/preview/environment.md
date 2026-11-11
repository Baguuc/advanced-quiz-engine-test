# Zmienne środowiskowe dla wersji podglądowej

`docker-compose.preview.yaml` uruchamia frontend i backend razem w jednym kontenerze oraz PostgreSQL jako osobny serwis. Ustaw w pliku `.env` trzy zmienne:

### APP_URL
Publiczny adres aplikacji, np. `http://localhost:5173`. Jest używany podczas budowania frontendu oraz przez backend jako bazowy adres aplikacji i zaufane źródło CORS.

### AUTH_SECRET
Długi, losowy sekret używany przez moduł autoryzacji.
na potrzeby podglądowe użyj prostego klucza, np. 1234.

### DATABASE_URL
Adres połączenia z bazą danych. Dla bazy uruchamianej przez ten plik Compose użyj `postgresql://dev:dev@postgres:5432/quiz-engine`.
Przykładowy plik znajduje się w [`.env.example`](../../.env.example). Aplikacja jest dostępna na porcie `5173`; backend nasłuchuje wewnętrznie na porcie `3000`, a Nginx przekazuje do niego żądania `/rpc` i `/auth`.