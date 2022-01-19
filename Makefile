install: install-deps
	npx simple-git-hooks

install-deps:
	npm ci

test:
	npm test

lint:
	npx eslint .