# Komendy docker compose

---
- Start<br>`docker compose up -d`
- Stop<br>`docker compose down`
- Stop i usuń dane z bazy<br>`docker compose down -v`
- Zobacz logi z postgresa<br>`docker compose logs -f postgres`
- Otwórz psgl w kontenerze<br>`docker exec -it quiz-engine-db psql -U dev -d quiz-engine`