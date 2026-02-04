# Documentation

This directory serves as a **living knowledge base** for the codebase. It should be treated as institutional memory—a place to capture decisions, preferences, and workflows that help anyone (human or AI) work effectively with the project.

## Purpose

These docs are meant to be **read and updated frequently** as the codebase evolves. When working on this project, Claude should:

1. **Consult these docs** before making stylistic or architectural decisions
2. **Update docs** when discovering new patterns, preferences, or workflows
3. **Add new docs** when a recurring topic warrants its own reference

## What Belongs Here

To avoid violating DRY, documentation should capture knowledge that **isn't obvious from reading the code itself**:

- **Stylistic preferences** — Coding conventions, naming patterns, formatting choices
- **Workflows** — Development processes, deployment steps, common tasks
- **Tooling** — External tools, scripts, environment setup
- **Architectural decisions** — The "why" behind major choices (not the "what" which is in the code)
- **Gotchas and edge cases** — Non-obvious behaviors or pitfalls to avoid

## What Does NOT Belong Here

- API documentation that duplicates code comments or type definitions
- Step-by-step explanations of what code does (the code should be self-documenting)
- Information that will become stale if the code changes without updating the docs

## Current Documents

- `tech-stack.md` — Technologies and libraries used
- `best-practices.md` — Coding conventions and patterns to follow
- `workflow.md` — Development processes and commands
- `environment-variables.md` — Environment configuration
- `ui-components.md` — UI component guidelines
- `database.md` — Database schema and patterns
