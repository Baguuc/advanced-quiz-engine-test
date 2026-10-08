# advanced-quiz-engine

Ale syf :D

---
## Development
### Prerequisites
- Docker
- Docker Compose
- Node.js
- Pnpm

### Start
```
git clone https://github.com/Vtraxio/advanced-quiz-engine.git
cd advanced-quiz-engine
git checkout staging
pnpm install
docker compose up -d
pnpm run db:migrate
pnpm run dev
```

### Docker Compose db commands
```
# Start
docker compose up -d

# Stop
docker compose down

# Stop AND delete the database data
docker compose down -v

# See Postgres logs
docker compose logs -f postgres

# Open psql inside the container
docker exec -it quiz-engine-db psql -U dev -d quiz-engine
```

### Running tests
```
pnpm run db:test:migrate
pnpm run test
```

---
## Documentation
See [docs/index.md](docs/index.md)