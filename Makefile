.PHONY: setup
setup:
	cp .env.dist .env
	./shell/gen-keys
	./shell/prisma migrate
	
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