# Arbeitsagentur Jobsuche API

Base: `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service`. Use header `X-API-Key: jobboerse-jobsuche`.

- Search: `GET /pc/v6/jobs` with `was`, `wo`, `veroeffentlichtseit`, `page`, `size`, and `angebotsart=34` for Praktikum/Trainee.
- Detail: `GET /pc/v4/jobdetails/{base64(refnr)}`.

The API returns `stellenangebote`; each item carries a reference number, title, employer, location, publication date, and sometimes an external employer URL. This technical reference deliberately does not duplicate the candidate profile.
