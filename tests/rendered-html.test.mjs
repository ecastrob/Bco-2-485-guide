import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(html, />Start or recertify BAH \(DA Form 5960\)</i);
  assert.match(html, />Complete a developmental counseling</i);
});
