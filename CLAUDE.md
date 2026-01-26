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

## Reviewing Recently Changed Files

When asked to review recently merged PRs or changed files, use **batch operations** for efficiency:

### DO (Efficient Approach):
1. **Get all changed files at once**: Use `git diff --name-only` or list recent PRs to see all affected files
2. **Find common issues with grep/sed**: Use simple patterns to identify recurring problems across all files
   - Example: `grep -l 'link:.*---$'` to find link formatting issues
   - Example: `grep -l 'remarks:.*"$'` to find missing closing quotes
3. **Report all issues first**: List all problems found before attempting fixes
4. **Fix in batch when possible**: Use sed or simple scripts to fix the same issue across multiple files
5. **Test once at the end**: Run `hugo` after all fixes are complete

### DON'T (Inefficient Approach):
- ❌ Read and check files one by one
- ❌ Make individual edits for each file separately
- ❌ Test after every single change
- ❌ Use complex solutions (Python scripts, spawning agents) for simple pattern fixes
- ❌ Get stuck debugging YAML parsing for individual files

### Common YAML Issues to Check:
- **Missing closing quotes**: `remarks: "text...` should end with `"`
- **Malformed links**: `link: (URL)---` should be `link: URL` on one line, `---` on the next
- **Trailing spaces**: Fields ending with spaces (use `sed` to strip)
- **Missing scores**: Empty `score:` fields
- **Empty beneficiaries**: Fields with no list items

## Data Quality Notes

### General Formatting
- Links should be full URLs with `https://`
- Use `<br /><br />` for paragraph breaks in YAML string fields
- Attribution field values: "required", "not required", "required if reasonably possible"
- Ensure all YAML strings are properly quoted and closed (no stray quotes or line breaks mid-string)

### Date Accuracy
- The `date` field should reflect when the **specific legal provision** came into force, not general reform dates
- Verify dates against official legal sources, especially for provisions that existed before reforms
- Example: UrhWissG provisions (§60a-§60f) came into force 2018-03-01, not 2017-09-01

### Draft Status and Implementation
- If a directive is actually implemented in national law, set `draft: false` and populate all fields
- Empty draft files may indicate missing implementations that need research
- Score 0 files (not implemented) should have `draft: false` but minimal content (empty title/description)

### Score Accuracy
- Score should accurately reflect implementation level based on actual legal provisions:
  - 0 = Not implemented
  - 1 = Partial/restrictive implementation
  - 2 = Substantial implementation with conditions
  - 3 = Full implementation
- Verify score matches the substantive legal content described

### Links and References
- Links should point to the specific section/article referenced in the title
- Preferred sources: Official legal databases (e.g., dejure.org, gesetze-im-internet.de)
- Verify links are current and accessible

### Complex Implementations
- When one file covers multiple legal provisions (e.g., §60a, §60b, §60c), note this clearly in the remarks
- Consider whether complex multi-provision exceptions should be split into separate files
- Remarks should provide context about relationship to other provisions or directives
