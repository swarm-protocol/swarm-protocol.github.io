# Agents

This document defines the agent configuration template for the swarm-protocol project.

## Overview

Agents are AI-powered assistants that help with development, testing, and maintenance of this repository. Each agent has a specific role and set of capabilities.

## Agent Template

```yaml
name: <agent-name>
description: <what the agent does>
triggers:
  - <event that activates the agent>
capabilities:
  - <capability-1>
  - <capability-2>
tools:
  - <tool-1>
  - <tool-2>
```

## Defined Agents

### Code Review Agent
- **Name:** code-reviewer
- **Description:** Reviews pull requests for code quality and consistency
- **Triggers:** `pull_request`
- **Capabilities:** Static analysis, style checks, best practices validation

### Test Agent
- **Name:** test-runner
- **Description:** Runs validation workflows and reports results
- **Triggers:** `push`, `pull_request`
- **Capabilities:** HTML validation, connection testing, service worker verification

### Documentation Agent
- **Name:** doc-writer
- **Description:** Keeps documentation in sync with code changes
- **Triggers:** `push` (when source files change)
- **Capabilities:** Markdown generation, README updates, workflow documentation

## Adding a New Agent

1. Define the agent using the template above
2. Add the agent configuration to this file
3. Create any associated workflow files in `.github/workflows/`
4. Document the agent's behavior and expected outputs

## Project Context

This repository hosts a collection of static web applications served via GitHub Pages:

| Application | Path | Description |
|-------------|------|-------------|
| Landing Page | `/` | Main entry point with navigation |
| Emotes | `/public/emotes/` | Emoji/emotes PWA for resizing and sharing |
| Blog | `/public/blog/` | Blogging platform |
| File Host | `/public/filehost/` | File upload and hosting service |
| Nopaste | `/public/nopaste/` | Code pastebin with syntax highlighting |
| Feeds | `/public/feeds/` | Feed/RSS reader |
| IRC | `/public/irc/` | IRC chat client |

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Styling:** JetBrains Mono font, earthy color palette (#f5f3ef, #9a77ff, #c19a6b)
- **PWA:** Service workers and manifest files for offline support
- **Hosting:** GitHub Pages (static site)
- **CI/CD:** GitHub Actions for validation and connection testing

## Guidelines

- Keep all applications as standalone static HTML files
- Maintain consistent styling across applications
- Ensure service worker cache references are up to date when adding new files
- Validate HTML structure and PWA manifests in CI
- Document new applications and workflows in `docs/`

## Configuration

Agent behavior can be customized through configuration files placed in the repository root or in the `.github/` directory. This file (`agents.md`) serves as both the agent template and the Claude agent configuration (symlinked as `claude.md`).
