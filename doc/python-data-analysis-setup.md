# Python Data Analysis Setup (Polars)

This guide documents a beginner-friendly Python setup for this repository, focused on JSONL analysis and progressive tooling.

## Goals

- Add a standalone Python subproject in `python/`.
- Keep integration with existing repo workflows (`Makefile`, shared conventions).
- Start with real data from linked Obsidian documents.
- Avoid premature schema lock-in by using layered data modeling.

## Recommended Path

### Phase 1: Minimal (run code fast)

Use this phase to learn Python fundamentals while producing useful output quickly.

- Create an isolated environment.
- Install Polars.
- Normalize a small subset of real data.
- Run first analysis metrics.

### Phase 2: Balanced (repeatable)

- Add tests for parse and shape failures.
- Add formatter and basic linting.
- Keep scripts deterministic and idempotent.

### Phase 3: Full (strict)

- Add static typing checks.
- Add stronger lint/test gates.
- Add CI checks for Python targets.

## Data Strategy (Important)

Do not create a large amount of new synthetic data first.

Instead, define a minimal canonical schema and normalize a small subset of existing data. Expand only after validating that schema supports real questions.

### Three Data Layers

1. Bronze: raw records exactly as extracted (append-only JSONL).
2. Silver: normalized records with stable field names and types.
3. Gold: analysis-ready datasets for specific questions.

### Canonical Starter Schema

Use a minimal schema with nullable fields where needed:

- `record_id`
- `source_path`
- `entity`
- `relation`
- `value`
- `event_time`
- `tags`
- `raw_payload`

## Proposed Folder Layout

```text
python/
  README.md
  pyproject.toml
  data/
    raw/
    normalized/
    reports/
  src/
    extract_obsidian_links.py
    normalize_records.py
    analyze.py
  tests/
    test_normalize_records.py
```

## Day 1 Walkthrough (Script-First)

### 1) Initialize project tooling

Use Python 3.12+ and `uv`.

```bash
cd python
uv init
uv python install 3.12
uv venv
source .venv/bin/activate
uv add polars
```

Why this is standard:

- `uv` manages env + deps quickly with lockfile support.
- Per-project venv avoids global package conflicts.
- Pinning version keeps behavior reproducible.

### 2) Create first raw sample

- Put a small JSONL sample in `python/data/raw/`.
- Keep one object per line.
- Keep malformed-line examples for tests later.

### 3) Build first normalizer

`normalize_records.py` should:

- Read JSONL safely line-by-line.
- Skip empty lines.
- Capture parse errors with line numbers.
- Map source objects into the canonical schema.
- Write deterministic normalized JSONL to `python/data/normalized/`.

### 4) Build first analysis script

`analyze.py` should compute:

- total records
- missing required fields counts
- top entities or relations
- date coverage of `event_time`

### 5) Validate outputs

- Confirm normalized file row count.
- Confirm malformed lines are reported, not silently dropped.
- Confirm rerun produces the same normalized output.

## Makefile Integration

Add Python targets to the repo `Makefile` so Python can be run like Go/TS tasks.

Suggested targets:

- `py-setup`: initialize env and install deps
- `py-normalize`: run normalization
- `py-analyze`: run analysis
- `py-test`: run tests (Phase 2+)
- `py-fmt`, `py-lint`, `py-typecheck` (Phase 2/3)

This keeps onboarding simple: one command path for each task area.

## .gitignore Additions

Add Python artifacts to root `.gitignore`:

```gitignore
# Python
python/.venv/
__pycache__/
*.pyc
.python-version
.pytest_cache/
.mypy_cache/
```

## Notebook Timing

Start script-first now. Add Jupyter in Phase 2 after normalization is stable.

Reason:

- Scripts are easier to version, test, and automate first.
- Notebooks become more useful once clean normalized datasets exist.

## Rules to Keep You Safe While Learning

- Never mutate bronze (raw) inputs.
- Keep transform scripts idempotent.
- Prefer explicit column names over implicit structure.
- Fail loudly on schema-breaking changes.

## Next Steps

1. Scaffold `python/` with `uv`, Polars, and the folder layout above.
2. Add Makefile targets for `py-setup`, `py-normalize`, and `py-analyze`.
3. Build the first JSONL normalizer against a small Obsidian-linked sample.
4. Add one regression test for malformed JSONL lines.
