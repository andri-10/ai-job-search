import { describe, expect, test } from "bun:test";
import { parseDetail, parseJobCards } from "../src/helpers";
import { parseJSON, runCLI } from "./helpers";

const fixture = `
<article>
  <a href="/en/jobs/361933/open-internship-and-thesis-project-opportunities/"></a>
  <h3>Open internship &amp; thesis project opportunities</h3>
  <p>Research opportunity</p>
  <span>Deadline 14 Dec ’26 Published 17 Jun ’26 Amsterdam</span>
  <img src="/images/logo/organisation-logo-serp/" alt="ARCNL">
</article>`;

describe("AcademicTransfer parser", () => {
  test("normalizes a server-rendered result card", () => {
    expect(parseJobCards(fixture, new Date("2026-09-02T00:00:00Z"))).toEqual([
      {
        id: "361933",
        title: "Open internship & thesis project opportunities",
        company: "ARCNL",
        location: "Amsterdam",
        date: "2026-06-17",
        deadline: "2026-12-14",
        url: "https://www.academictransfer.com/en/jobs/361933/open-internship-and-thesis-project-opportunities/",
      },
    ]);
  });

  test("extracts the public detail description across Nuxt comments", () => {
    const detail = parseDetail(`
      <a href="/en/jobs/361933/open-internship/"></a>
      <h1><!--[-->Open internship<!--]--></h1>
      <p>Deadline 14 Dec ’26 Published 17 Jun ’26 Vacancy ID 3468</p>
      <p>Location<br>Science Park 106, Amsterdam</p>
      <section><h2><!--[-->Job description<!--]--></h2><div><strong>Work Activities</strong><br>Build useful systems.</div></section>
      <section><h2><!--[-->Employer information<!--]--></h2><img alt="ARCNL"></section>
      <a href="/en/jobs/361933/open-internship/apply/">Apply</a>
    `, "361933");
    expect(detail.description).toBe("Work Activities\nBuild useful systems.");
    expect(detail.company).toBe("ARCNL");
  });

  test("writes argument errors as JSON to stderr", async () => {
    const result = await runCLI(["search", "--bogus"]);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(parseJSON(result.stderr).code).toBe("BAD_ARG");
  });

  test.skipIf(process.env.LIVE_TEST !== "1")("returns a live vacancy", async () => {
    const result = await runCLI(["search", "-q", "internship", "--limit", "1"]);
    const data = parseJSON(result.stdout) as { results: Array<Record<string, unknown>> };
    expect(result.exitCode).toBe(0);
    expect(data.results[0]?.id).toBeTruthy();
    expect(data.results[0]?.title).toBeTruthy();
    expect(data.results[0]?.url).toBeTruthy();
  });
});
