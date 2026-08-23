import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("resets the window scroll position when the selected guide changes", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
  assert.match(source, /\}, \[activeId\]\);/);
});

test("provides a Formspree-backed support form without the print action", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /https:\/\/formspree\.io\/f\/mgawbllz/);
  assert.match(source, /Feedback or Request for Delta Rays 3-323 Soldier Guide/);
  assert.match(source, /Submit feedback/);
  assert.match(source, /Request a guide or feature/);
  assert.match(source, /name="request_subject"/);
  assert.match(source, /name="details"/);
  assert.match(source, /name="submitted_by"/);
  assert.doesNotMatch(source, /window\.print/);
});

test("uses Home as the default landing page without an All Guides directory", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /Welcome to the Delta Rays 3-323 Soldier Guide/);
  assert.doesNotMatch(source, /B Co 2-485|B Co Soldier Guide/i);
  assert.match(source, /className=\{activeId \? "home-nav" : "home-nav active"\}/);
  assert.match(source, /hasQuery && <section className="home-results"/);
  assert.doesNotMatch(source, /selectAllGuides|>All Guides<|GUIDE LIBRARY/);
});

test("retains the core MVP guide coverage", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  for (const title of [
    "Access and navigate IPPS-A Self-Service",
    "Submit and track an IPPS-A personnel action",
    "Start and complete your NCOER Support Form — Rated NCO",
    "Initiate and complete an NCOER — Rater",
    "Review and sign an NCOER — Rated NCO",
    "Write strong, honest NCOER comments",
    "Create and submit a DTS authorization",
    "Create and submit a DTS voucher",
    "Start or recertify BAH (DA Form 5960)",
    "Complete a developmental counseling",
  ]) assert.match(source, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("renders the Soldier guide Home page", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>Delta Rays 3-323 Soldier Guide<\/title>/i);
  assert.match(html, />Home</i);
  assert.match(html, /Welcome to the Delta Rays 3-323 Soldier Guide/i);
  assert.match(html, /Search by task, system, or topic/i);
  assert.match(html, />Set up and access Army AVD</i);
  assert.match(html, /Skip to guide content/i);
  assert.match(html, /Independent project—not an official Army or unit publication/i);
  assert.match(html, /Created by an NCO for Reserve Soldiers\./i);
  assert.doesNotMatch(html, /Reserve Soldiers and NCOs/i);
  assert.match(html, /not affiliated with, endorsed by, or an official publication/i);
  assert.doesNotMatch(html, />All Guides</i);
  assert.doesNotMatch(html, /GUIDE LIBRARY/i);
  assert.doesNotMatch(html, /B Co 2-485|B Co Soldier Guide/i);
  assert.doesNotMatch(html, /Draft — pending verification/i);
  assert.doesNotMatch(html, /updated:\s*["']Pending["']/i);
});
