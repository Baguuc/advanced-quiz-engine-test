# Komendy docker compose

### Komendy dev:
- Start<br>`docker compose -f docker-compose.dev.yaml up -d`
- Stop<br>`docker compose  -f docker-compose.dev.yaml down`
- Stop i usuń dane z bazy<br>`docker compose -f docker-compose.dev.yaml down -v`
- Zobacz logi z postgresa<br>`docker compose logs -f postgres`
- Otwórz psgl w kontenerze<br>`docker exec -it quiz-engine-db psql -U dev -d quiz-engine`