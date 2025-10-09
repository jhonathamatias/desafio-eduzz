.PHONY: setup
// TODO: Revisar o setup para rodar apenas na primeira vez
setup:
	cp .env.dist .env
	docker compose up -d
	./shell/gen-keys
	./shell/prisma migrate dev
	./shell/prisma db seed
	
.PHONY: start
start:
	docker compose up -d

.PHONY: stop
stop:
	docker compose stop

.PHONY: restart
reload:
	docker compose stop
	docker compose up -d

.PHONY: logs
logs:
	docker compose logs -f node

.PHONY: test
test:
	docker compose exec node yarn test

.PHONY: gen-keys
gen-keys:
	./shell/gen-keys

.PHONY: container
container:
	docker compose exec node sh

PHONY: migrate
migrate:
	./shell/prisma migrate dev

.PHONY: seed
seed:
	./shell/prisma db seed

.PHONY: workers
workers:
	./shell/yarn start-workers