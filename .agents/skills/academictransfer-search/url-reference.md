# AcademicTransfer URL reference

Verified 2026-09-02.

## Access boundary

- Public site: `https://www.academictransfer.com`
- Search: `GET /en/jobs/?q=<keywords>`
- Detail: `GET /en/jobs/<id>/<slug>/`
- Canonical ID-only redirect: `GET /<id>/`
- The public robots policy allows ordinary public pages, disallows `/account/` and
  `/apply/`, and publishes a 10-second crawl delay.
- `https://api.academictransfer.com` requires credentials and its own robots policy
  disallows automated access. The CLI must not use it or recover credentials from
  the web application.

## Search behavior

| CLI input | Portal mapping |
|---|---|
| `--query`, `-q` | `q` query parameter |
| `--location`, `-l` | appended to `q`; no separate public location parameter |
| `--jobage` | client-side filter over parsed `Published` dates |
| `--page` | public HTML supports page 1 only |
| `--limit` | client-side cap, maximum 10 server-rendered results |

The server-rendered result card is an `<article>` containing:

- canonical relative URL: `/en/jobs/<id>/<slug>/`
- title: `<h3>`
- employer: organisation logo `alt` plus adjacent employer label
- deadline, published date, and location in the card metadata text

Dates may be absolute (`19 Jun '26`) or relative (`today`, `yesterday`). Missing
fields are normalized to `null`.

## Detail behavior

The public detail page provides the title, deadline, publication date, vacancy ID,
location, job-description section, employer information, and an application link.
The CLI extracts the description from the public page but never follows the
`/apply/` link.

## Maintenance notes

The site is server-rendered by Nuxt and class names may change. Prefer semantic
anchors (`/en/jobs/<id>/`, `<h3>`, `Job description`, `Published`) over generated
`data-v-*` attributes or utility-class strings. Parse each `<article>` independently
so a malformed card does not corrupt other results.

