---
name: conventional-commits
description: >
  Helps craft, validate, and suggest git commit messages following the Conventional Commits v1.0.0 specification.
  Use this skill whenever the user wants to write a commit message, asks how to commit their changes, wants
  to validate or fix an existing commit message, or says things like "commit this", "what should my commit
  message be", "help me write a commit", "review my commit message", "is this a good commit message", or
  "how do I write commits properly". Also trigger when the user pastes a diff/changeset and asks what to do
  with it, or when they mention git commits in any context — even casually. This skill produces commit
  messages that are human-readable, machine-parseable, and SemVer-compatible.
---

# Conventional Commits Skill

This skill guides Claude in producing, validating, and explaining commit messages that conform to the
[Conventional Commits v1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/).

---

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Rules

1. **type** — REQUIRED. A lowercase noun describing the category of change.
2. **scope** — OPTIONAL. A noun in parentheses describing the part of the codebase affected, e.g. `feat(auth):`.
3. **`!`** — OPTIONAL. Appended immediately before `:` to signal a BREAKING CHANGE.
4. **description** — REQUIRED. A short, imperative-mood summary right after `type[scope]: `.
5. **body** — OPTIONAL. Separated by one blank line from the description. Free-form paragraphs.
6. **footers** — OPTIONAL. Separated by one blank line from the body. Format: `Token: value` or `Token #value`.
   - Token uses `-` instead of spaces (e.g. `Reviewed-by:`), EXCEPT `BREAKING CHANGE` which keeps the space.

---

## Type Reference

| Type       | When to use                                             | SemVer impact |
|------------|---------------------------------------------------------|---------------|
| `feat`     | New feature added to the codebase                       | MINOR         |
| `fix`      | Bug fix                                                 | PATCH         |
| `docs`     | Documentation only changes                              | –             |
| `style`    | Formatting, whitespace, missing semicolons — no logic   | –             |
| `refactor` | Code restructured without adding features or fixing bugs| –             |
| `perf`     | Performance improvement                                 | –             |
| `test`     | Adding or correcting tests                              | –             |
| `build`    | Build system or external dependency changes             | –             |
| `ci`       | CI/CD configuration changes                            | –             |
| `chore`    | Maintenance tasks that don't fit other types            | –             |
| `revert`   | Reverts a previous commit                               | –             |

> **BREAKING CHANGE** (any type) correlates with a MAJOR SemVer bump. Signal it with `!` and/or a `BREAKING CHANGE:` footer.

---

## Workflow: How Claude Should Handle Requests

### 1. Understand the change
- If the user provides a diff, code snippet, or description → analyze it to infer the correct type, scope, and description.
- If the intent is ambiguous → ask one focused clarifying question (not multiple).

### 2. Determine type and scope
- Pick the **most specific** applicable type from the table above.
- Identify scope from: file/module name, feature area, package name, route, component, etc.
- Use scope only when it adds meaningful context. Omit it for small or single-concern repos.

### 3. Write the description
- Use **imperative mood**, present tense: "add", "fix", "remove" — NOT "added", "fixes", "removing".
- Keep it under ~72 characters.
- Don't end with a period.
- Be specific: say *what* changed, not just that something changed.

### 4. Write body (if needed)
- Add a body when the *why* or *how* isn't obvious from the description.
- Separate from description with one blank line.
- Wrap lines at ~72 characters.

### 5. Write footers (if applicable)
- `BREAKING CHANGE: <explanation>` — when a breaking change is introduced.
- `Refs: #<issue>` — when referencing issues/tickets.
- `Reviewed-by: <name>` — when acknowledging reviewers.
- `Co-authored-by: Name <email>` — when pairing.

### 6. Present the commit message
Always present the final commit message in a code block. Optionally explain the choices made.

---

## Examples

### Simple feature
```
feat(auth): add OAuth2 login via Google
```

### Bug fix with issue reference
```
fix(api): handle null response when user not found

Refs: #204
```

### Breaking change with `!` and footer
```
feat(config)!: remove support for YAML config files

BREAKING CHANGE: only JSON config files are supported going forward.
Migrate your .yml config to .json before upgrading.
```

### Refactor with body
```
refactor(parser): extract token validation into separate module

Previously, token validation logic was scattered across three files.
This change consolidates it into parser/validation.ts for easier
testing and maintenance.
```

### Revert
```
revert: restore previous rate limiting behavior

Refs: a3f91bc, d2c0411
```

### Multi-footer
```
fix: prevent race condition in request queue

Introduce a request ID and reference to the latest request.
Dismiss incoming responses other than from the latest request.
Remove obsolete timeouts.

Reviewed-by: Alice
Refs: #319
```

---

## Validation Checklist

When asked to validate an existing commit message, check each item:

- [ ] Has a valid `type`
- [ ] `type` is lowercase (consistent casing is RECOMMENDED)
- [ ] Has a `description` immediately after `type[scope]: `
- [ ] Description uses imperative mood and is ≤72 chars
- [ ] Description does not end with a period
- [ ] Body (if present) is separated by exactly one blank line
- [ ] Footers (if present) are separated by exactly one blank line from body
- [ ] `BREAKING CHANGE` footer is uppercase
- [ ] Footer tokens use `-` instead of spaces (except `BREAKING CHANGE`)
- [ ] Breaking changes are signaled via `!` and/or `BREAKING CHANGE:` footer

If violations are found, explain each one and offer a corrected version.

---

## Tips & Edge Cases

- **Multiple changes in one commit?** Suggest splitting into separate commits — this is a core intent of the convention.
- **Initial commit?** Use `chore: initial commit` or `feat: initial project scaffold`.
- **Dependency updates?** Use `build(deps): update lodash to 4.17.21`.
- **Typo/formatting only?** Use `style:` (no logic changed) or `docs:` (in documentation files).
- **WIP commits?** Mention that WIP commits are typically squashed before merging; the final squashed commit should follow this convention.
- **Scope naming?** Use kebab-case for multi-word scopes: `feat(user-profile):`.

---

## Quick Reference Card

```
feat:      New feature                   → MINOR release
fix:       Bug fix                       → PATCH release
feat!:     Breaking new feature          → MAJOR release
fix!:      Breaking bug fix              → MAJOR release
docs:      Documentation
style:     Formatting only
refactor:  No feature/fix, restructure
perf:      Performance improvement
test:      Tests added/fixed
build:     Build system / dependencies
ci:        CI/CD config
chore:     Maintenance
revert:    Undo a commit
```