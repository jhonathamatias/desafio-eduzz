.PHONY: setup
setup:
	cp .env.example .env
	docker build . -f docker/dev.Dockerfile -t hyperf-dev-server --no-cache
	docker run --rm -v ".:/opt/www" -u ${UID}:${GID} hyperf-dev-server composer install

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
