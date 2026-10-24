# Zmienne środowiskowe

---

### Wymanage zmienne

| Nazwa zmiennej       | Opis                                                                                                                                                                                                                                                                                                                                           |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `DATABASE_URL`       | Adres URL do bazy danych. Jeśli bazę danych odpalasz przez docker compose, wpisz `postgresql://dev:dev@localhost:5432/quiz-engine`.                                                                                                                                                                                                            |
| `BETTER_AUTH_URL`    | Adres to backendu, jeśli odpalasz projekt lokalnie będzie to `http://localhost:3000`.                                                                                                                                                                                                                                                          |
| `BETTER_AUTH_SECRET` | Klucz prywany do szyfrowania danych. Wygeneruj randomowy ciąg znaków używając komendy `openssl rand -base64 32`. Jeśli nie jest dostępna wykożystaj generator na [stronie better-auth](https://better-auth.com/docs/installation#set-environment-variables). Nie zmieniaj klucza po jego ustawieniu, będziesz musiał wyjebać całą bazę danych. |