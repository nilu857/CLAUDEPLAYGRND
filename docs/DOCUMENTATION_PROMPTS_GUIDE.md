# Documentation Prompts Guide

How to prompt Claude/Copilot to create concise, well-structured documentation without generating overly verbose files.

---

## Quick Rules

1. **Always specify length** - "Keep it under 50 lines"
2. **Define sections** - Tell exactly what to include/exclude
3. **Say "concise"** - Explicitly request brevity
4. **Give examples** - Show the format you want

---

## README Prompts

### Project README (Concise)
```
"Create a README.md for this project. Keep it under 100 lines.

Include ONLY:
- Project name and one-line description
- Quick start (3-5 commands max)
- Basic usage example
- Link to detailed docs

Do NOT include:
- Detailed API documentation
- Full configuration options
- Contributing guidelines
- Changelog"
```

### Module/Feature README
```
"Write a brief README for the [feature] module. Max 50 lines.

Structure:
## What it does (2-3 sentences)
## Usage (one code example)
## Configuration (table format, key options only)"
```

### Minimal README
```
"Create a minimal README with ONLY:
# Title
One paragraph description
## Install
[command]
## Run
[command]

Nothing else. Max 20 lines."
```

---

## Instruction Files (INSTRUCTIONS.md)

### Setup Instructions
```
"Write INSTRUCTIONS.md for project setup. Numbered steps only, no explanations.

Format:
1. Step one
2. Step two

Max 30 lines. No prose, just commands and brief labels."
```

### Developer Onboarding
```
"Create a quick-start guide for new developers. Max 40 lines.

Include:
- Prerequisites (bullet list)
- Setup steps (numbered, commands only)
- How to run tests (one command)
- How to run locally (one command)

Skip explanations - developers can figure it out."
```

---

## API Documentation

### Endpoint Documentation
```
"Document the /api/users endpoints. Use this exact format for each:

### METHOD /path
Brief description (one line)
**Request:** `{field: type}`
**Response:** `{field: type}`
**Example:** curl command

No prose. Max 10 lines per endpoint."
```

### Function Documentation
```
"Add JSDoc to these functions. One line description, params, returns. No examples, no lengthy explanations.

Format:
/**
 * Brief description
 * @param {type} name - what it is
 * @returns {type} what it returns
 */"
```

---

## Code Comments

### File Header
```
"Add a file header comment. Max 5 lines:
- What this file does (one sentence)
- Main exports
- Dependencies if unusual"
```

### Inline Comments
```
"Add comments to this code. Rules:
- Only comment non-obvious logic
- Max one line per comment
- No comments on self-explanatory code
- Use // not /* */"
```

---

## Changelog & Release Notes

### Changelog Entry
```
"Write changelog entry for version X.X.X. Format:

## [X.X.X] - YYYY-MM-DD
### Added
- item
### Changed
- item
### Fixed
- item

One line per item. No descriptions."
```

### Release Notes
```
"Write release notes. Max 20 lines.

## What's New
- Feature 1 (one sentence)
- Feature 2 (one sentence)

## Breaking Changes
- Change (migration: do X)

No marketing speak."
```

---

## Configuration Documentation

### Config File Docs
```
"Document config options as inline comments in the config file itself.

Format:
{
  // What this does (required/optional)
  "option": "default"
}

Don't create separate documentation file."
```

### Environment Variables
```
"Create .env.example with comments. Format:

# Description (required/optional)
VARIABLE_NAME=example_value

Max 30 lines. Group related vars."
```

---

## Anti-Patterns to Avoid

### DON'T Say:
```
"Create documentation for this project"
"Write a comprehensive README"
"Document all the features"
"Explain how the code works"
```

### DO Say:
```
"Create a 50-line README with only setup and usage"
"Write brief inline comments for complex logic only"
"Document the 3 main API endpoints, 10 lines each"
"Add a one-paragraph description to this file"
```

---

## Templates

### Minimal README Template
```markdown
# Project Name

One sentence description.

## Quick Start
\`\`\`bash
npm install
npm start
\`\`\`

## Docs
See [docs/](./docs/) for details.
```

### Minimal INSTRUCTIONS Template
```markdown
# Setup

1. Clone: `git clone [url]`
2. Install: `npm install`
3. Configure: `cp .env.example .env`
4. Run: `npm start`

# Testing
`npm test`
```

### Minimal API Doc Template
```markdown
# API

## GET /resource
Returns all items.

## POST /resource
Creates item. Body: `{name: string}`

## DELETE /resource/:id
Deletes item by ID.
```

---

## Length Guidelines

| Document Type | Recommended Lines |
|--------------|-------------------|
| Project README | 50-100 |
| Module README | 30-50 |
| INSTRUCTIONS.md | 20-40 |
| API endpoint doc | 5-10 per endpoint |
| Config comments | 1 line per option |
| File header | 3-5 |
| Changelog entry | 10-20 |

---

## Master Prompt Template

Use this template for any documentation request:

```
"Create [DOCUMENT TYPE] for [TARGET].

Length: Max [N] lines

Include:
- [Section 1]
- [Section 2]

Exclude:
- [Unnecessary section]
- [Verbose explanations]

Format: [table/bullets/numbered/prose]

Style: Concise, no fluff, developer-focused"
```
