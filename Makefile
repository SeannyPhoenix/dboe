.PHONY: setup serve lint-ts lint-go lint fmt

GOLANGCI_LINT := $(shell which golangci-lint 2>/dev/null || echo $(shell go env GOPATH)/bin/golangci-lint)

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
