# LinkedIn Jobs URL Reference

Public, unauthenticated `jobs-guest` endpoints used for Andri Halili's configured
European Master's-thesis search. The endpoints remain global; the CLI passes one
approved market or city through `location` for each focused search.

> Personal use only — automated access is against LinkedIn's Terms of Service; keep volume low.

## Search

```text
GET https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search
```

| Parameter | Meaning | Candidate-focused example |
|---|---|---|
| `keywords` | Free-text query | `"master thesis" AI`, `Masterarbeit machine learning` |
| `location` | Place string | `Vienna, Austria`, `Germany`, `Switzerland`, `Remote` |
| `f_TPR` | Posted-within window in seconds | `r604800` (7d), `r2592000` (30d) |
| `f_WT` | Workplace type | `1` on-site, `2` remote, `3` hybrid |
| `start` | Pagination offset; 10 results per page | `0`, `10`, `20` |

The endpoint returns an HTML list of job cards. The CLI splits on
`data-entity-urn="urn:li:jobPosting:<id>"` and extracts the ID, title, company,
location, posting date, and canonical URL from each card independently.

## Detail

```text
GET https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/<jobId>
```

The detail response contains the title (`top-card-layout__title` or
`topcard__title`), company (`topcard__org-name-link`), location
(`topcard__flavor--bullet`), description (`show-more-less-html__markup` or
`description__text`), job-criteria fields, and apply link.

## Operational notes

- No authentication or API key is required.
- The CLI uses an honest `linkedin-search-cli/1.0` user agent, a 15-second timeout,
  and exponential backoff on 429/5xx responses.
- The endpoint is country-agnostic, but this repository limits searches to the
  locations configured in `CLAUDE.md` and `search-queries.md`.
- Search cards provide discovery metadata only. Retrieve detail before screening
  thesis compatibility, working language, compensation, timing, supervision, or
  work-authorisation viability.
- Keyword matching is fuzzy: a thesis query can return adjacent graduate or full-time
  roles. The query itself is never evidence that a result is thesis-compatible.
- If LinkedIn changes the markup or blocks public access, stop and update this
  reference and parser. Do not add authentication, private endpoints, or a bypass.
