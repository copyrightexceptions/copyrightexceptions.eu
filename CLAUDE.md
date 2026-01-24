# Copyright Exceptions EU

A Hugo static site documenting how EU copyright exceptions are implemented across European jurisdictions.

## Tech Stack

- **Hugo** static site generator (theme: `copex` in `/themes/copex/`)
- Content in Markdown with YAML front matter
- JSON output for map data (`home.json`, taxonomy JSON templates)
- Leaflet.js for interactive map on homepage

## Content Structure

```
/content/
├── exceptions/          # Exception definitions (_index.md per exception)
├── implementations/     # Implementation records by country (e.g., NL/, DE/, FR/)
└── jurisdictions/       # Country legal framework info
```

## Implementation Files

Each implementation file in `/content/implementations/{CC}/{exception}.md` contains:

- `title`: Name of the national law article
- `date`: Date legislation enacted
- `draft`: true/false (drafts not published)
- `score`: 0 (not implemented) to 3 (fully implemented)
- `description`, `beneficiaries`, `purposes`, `usage`, `subjectmatter`
- `compensation`, `attribution`, `otherConditions`, `remarks`
- `link`: URL to national legislation

**Note:** Score 0 entries intentionally have empty title/description (nothing to describe if not implemented).

## Taxonomies

- `exception` - Groups implementations by EU directive article (e.g., info51, dsm3)
- `jurisdiction` - Groups implementations by country code (e.g., NL, DE)

## Exception Naming

- `info51`, `info52a-e`, `info53a-o` - InfoSoc Directive (2001/29/EC)
- `dsm3-8` - DSM Directive (2019/790/EU)
- `mkd` - Marrakesh Directive
- `owd` - Orphan Works Directive

## Common Tasks

- **Run locally**: `hugo server`
- **Build**: `hugo`
- **Add implementation**: Create `.md` file in `/content/implementations/{CC}/`

## Data Quality Notes

- Links should be full URLs with `https://`
- Use `<br /><br />` for paragraph breaks in YAML string fields
- Attribution field values: "required", "not required", "required if reasonably possible"
