.PHONY: setup serve lint-ts lint-go lint fmt gen build watch-web dev

GOLANGCI_LINT := $(shell which golangci-lint 2>/dev/null || echo $(shell go env GOPATH)/bin/golangci-lint)

build: gen

gen:
	@go generate ./...

setup:
	@pnpm install

lint-ts:
	pnpm exec oxlint .

lint-go:
	@$(GOLANGCI_LINT) run

lint: lint-ts lint-go

fmt:
	pnpm exec oxfmt .

serve: 
	@go run ./cmd/dboe serve

watch-web:
	@DBOE_BUILD_ROOT=$(PWD) go run ./tools/build/ --watch

dev:
	@echo "Starting development environment..."
	@echo "Frontend watcher (TypeScript/esbuild) in process 1"
	@echo "Backend watcher (Go/air) in process 2"
	@(DBOE_BUILD_ROOT=$(PWD) go run ./tools/build/ --watch) & \
	(air) & \
	wait

