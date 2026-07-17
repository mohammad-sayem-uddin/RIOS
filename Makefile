.PHONY: help install build test lint format typecheck clean dev infra infra-down infra-health

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

build: ## Build all packages
	pnpm build

test: ## Run all tests
	pnpm test

lint: ## Run linting
	pnpm lint

format: ## Format code
	pnpm format

format-check: ## Check formatting
	pnpm format:check

typecheck: ## Run type checking
	pnpm typecheck

clean: ## Clean all build artifacts
	pnpm clean

dev: ## Start development servers
	pnpm dev

quality: ## Run all quality gates
	pnpm quality:gate

# Infrastructure
infra: ## Start local infrastructure (PostgreSQL, EventStoreDB, Redis, Qdrant)
	docker compose up -d

infra-down: ## Stop local infrastructure
	docker compose down

infra-health: ## Check infrastructure health
	@echo "Checking infrastructure health..."
	@docker compose ps --format "table {{.Name}}\t{{.Status}}"

infra-logs: ## Show infrastructure logs
	docker compose logs -f

infra-reset: ## Reset infrastructure (destroy volumes and restart)
	docker compose down -v
	docker compose up -d

# Database
db-migrate: ## Run database migrations
	pnpm db:migrate

db-seed: ## Seed the database
	pnpm db:seed

# Test infrastructure
test-infra: ## Start test infrastructure
	docker compose -f docker-compose.test.yml up -d

test-infra-down: ## Stop test infrastructure
	docker compose -f docker-compose.test.yml down

# Setup
setup: install infra ## Full local setup (install + infrastructure)
	@echo "✅ Local development environment ready"
	@echo "Run 'make dev' to start development servers"