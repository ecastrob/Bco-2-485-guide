import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("resets the window scroll position when the selected guide changes", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
  assert.match(source, /\}, \[activeId\]\);/);
});

test("renders the Soldier guide library", async () => {
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
  assert.match(html, /<title>B Co 2-485 Soldier Guide<\/title>/i);
  assert.match(html, />All Guides</i);
  assert.match(html, />Access and navigate IPPS-A Self-Service</i);
  assert.match(html, />Submit and track an IPPS-A personnel action</i);
  assert.match(html, />Start and complete your NCOER Support Form — Rated NCO</i);
  assert.match(html, />Initiate and complete an NCOER — Rater</i);
  assert.match(html, />Review and sign an NCOER — Rated NCO</i);
  assert.match(html, />Write strong, honest NCOER comments</i);
  assert.match(html, />Create and submit a DTS authorization</i);
  assert.match(html, />Create and submit a DTS voucher</i);
  assert.match(html, />Start or recertify BAH \(DA Form 5960\)</i);
  assert.match(html, />Complete a developmental counseling</i);
  assert.match(html, /Skip to guide content/i);
  assert.doesNotMatch(html, /Draft — pending verification/i);
  assert.doesNotMatch(html, /updated:\s*["']Pending["']/i);
});
