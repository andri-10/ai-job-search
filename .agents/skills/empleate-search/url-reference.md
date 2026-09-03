# Empléate URL Reference

Empléate is Spain's official SEPE employment aggregator. Its Angular client calls a
public Solr-style JSON endpoint. The endpoint is unauthenticated but undocumented, so
the CLI treats its current response shape as a monitored implementation detail.

## Public application

```text
https://empleate.gob.es/empleo/#/trabajo
```

## Search and detail data

```text
GET https://empleate.gob.es/empleate/open/offersearch/selectBuscador
```

| Parameter | Meaning | Example |
|---|---|---|
| `q` | Free-text search; `*` means all | `prácticas inteligencia artificial` |
| `q.op` | Query operator | `AND` |
| `rows` | Results per request | `10` |
| `start` | Zero-based result offset | `0`, `10`, `20` |
| `fq` | Repeatable Solr filter | `pais:724`, `provinciaF:"MADRID"` |
| `wt` | Response format | `json` |

Search uses `rows=10`, `start=(page-1)*10`, and always includes `fq=pais:724`.
`--location` emits a filter across `ciudadF`, `provinciaF`, and `comunidadF`.
`--jobage` emits a `fechaCreacion` date-range filter.

Exact-ID detail uses the same endpoint:

```text
q=*&rows=1&fq=id:<EMPLÉATE_ID>&wt=json
```

## Response structure

The useful fields live under `response.docs[]`:

| Output | Source field(s) |
|---|---|
| `id` | `id` |
| `title` | `titulo` |
| `company` | `companyContact`, `empresa`, or `nombreEmpresa` when explicitly present; otherwise `null` |
| `location` | `ciudadF`, `provinciaF`, `paisF` |
| `date` | `fechaCreacionPortal`, falling back to `fechaCreacion` |
| `url` | Absolute `url`, otherwise Empléate's public `#/oferta/<id>` route |
| `description` | `contenido` |
| `employmentType` | `tipoContrato` |
| `source` | `origen` |
| `category` | `categoriaF`, `subcategoriaF` |

Some upstream feeds omit the employer or provide `url: "#"`. Missing employer values
remain `null`; the source portal is not an employer. A missing external URL falls back
to the public Empléate offer route.

## Access boundary

- `https://empleate.gob.es/robots.txt` allowed the public site when checked on
  2026-09-03 and disallowed private company, profile, registered-offer,
  recommendation, favourite, and interested-company paths.
- Only the `open/offersearch/selectBuscador` route is used.
- No login, cookies, private APIs, registration, or application submission.
- Use an honest `empleate-search-cli/1.0` user agent, a 15-second timeout, and
  exponential backoff on 429/5xx responses.
- On Windows only, a Bun certificate-chain failure falls back to `Invoke-WebRequest`,
  which uses the operating system's trusted certificate store. TLS verification remains
  enabled; other network errors do not trigger the fallback.
- Recheck the portal, robots policy, and response fields before changing endpoints.
