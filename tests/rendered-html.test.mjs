import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("resets the window scroll position when the selected guide changes", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
  assert.match(source, /\}, \[activeId\]\);/);
});

test("keeps mobile content contained without breaking sticky desktop navigation", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(layout, /export const viewport: Viewport/);
  assert.match(layout, /width: "device-width"/);
  assert.match(layout, /initialScale: 1/);
  assert.match(styles, /html,body\{max-width:100%\}/);
  assert.doesNotMatch(styles, /html,body\{[^}]*overflow-x:hidden/);
  assert.match(styles, /\.app-shell,\.article-shell\{width:100%;min-width:0/);
  assert.match(styles, /\.sidebar\{align-self:flex-start\}/);
  assert.match(styles, /\.sidebar\{width:320px;flex:0 0 320px;position:sticky;top:0;height:100vh;overflow-y:auto/);
  assert.match(styles, /@media\(max-width:980px\)\{\.sidebar,.+\.article-content\{grid-template-columns:minmax\(0,1fr\);gap:0;width:100%;max-width:100%/);
});

test("uses the polished card layout for guide steps", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(source, /className="step-label">STEP \{index \+ 1\}/);
  assert.match(source, /<strong>EXPECTED RESULT<\/strong>/);
  assert.match(source, /className="step-expect-icon"/);
  assert.match(source, /const structureInstruction =/);
  assert.match(source, /className="step-lead"/);
  assert.match(source, /className="step-actions"/);
  assert.match(source, /step-callout-conditional/);
  assert.match(source, /step-callout-warning/);
  assert.doesNotMatch(source, /WHAT YOU SHOULD SEE/);
  assert.match(styles, /\.step\{position:relative;display:grid;grid-template-columns:44px minmax\(0,1fr\)/);
  assert.match(styles, /\.step-expect\{grid-column:1\/-1/);
  assert.match(styles, /\.nav-section-button\.section-active\{background:var\(--orange\)/);
  assert.match(styles, /overflow-wrap:anywhere/);
  assert.match(styles, /\.step-actions li:before/);
  assert.match(styles, /\.step-callout-conditional/);
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

test("installs privacy-conscious Google Analytics tracking", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(layout, /G-ZYXG181TKD/);
  assert.match(layout, /googletagmanager\.com\/gtag\/js/);
  assert.match(layout, /anonymize_ip:true/);
  assert.match(source, /trackEvent\("guide_open"/);
  assert.match(source, /trackEvent\("page_view"/);
  assert.match(source, /trackEvent\("site_search", \{ query_length: search\.length, result_count: searchResults\.length \}\)/);
  assert.match(source, /trackEvent\("support_submit"/);
  assert.doesNotMatch(source, /trackEvent\("site_search"[^\n]*query:/);
  assert.match(source, /Aggregate site usage is measured with Google Analytics/);
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
    "Request, transfer, or maintain ARNet access",
    "Set up and use Army AWS WickrGov",
    "Access and navigate IPPS-A Self-Service",
    "Submit and track an IPPS-A personnel action",
    "Start and complete your NCOER Support Form — Rated NCO",
    "Initiate and complete an NCOER — Rater",
    "Review and sign an NCOER — Rated NCO",
    "Write strong, honest NCOER comments",
    "Request IDT travel reimbursement",
    "Request Lodging-in-Kind (LIK)",
    "Create and submit a DTS authorization",
    "Create and submit a DTS voucher",
    "Create and submit a DTS local voucher",
    "Complete a Constructed Travel Worksheet",
    "Correct or supplement a DTS travel claim",
    "Start or recertify BAH (DA Form 5960)",
    "Complete a developmental counseling",
  ]) assert.match(source, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("provides current, unit-routed IDT travel and LIK guidance", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /IDT & Travel/);
  assert.match(source, /IDT-TRP coordinator confirmation of eligibility, funding, deadline, and claim method/i);
  assert.match(source, /Do not rely on an amount or mileage threshold from an older flyer/);
  assert.match(source, /Do not book a hotel yourself and assume the unit will reimburse it/);
  assert.match(source, /DTS Guide 4: Local Vouchers — Aug 2026/);
  assert.match(source, /The worksheet gives the AO information to authorize a travel mode and establish any reimbursement limit/);
  assert.match(source, /Do not create a second claim for the same trip or expense/);
});

test("provides a source-verified Pay and Personnel rollout", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /Pay & Personnel/);
  for (const title of [
    "Read and verify your Reserve LES",
    "Report missing or incorrect Reserve pay",
    "Update DD Form 93 and SGLI beneficiaries",
    "Review and correct your Army records",
    "Update direct deposit and tax withholding in myPay",
    "Start or recertify BAH (DA Form 5960)",
  ]) assert.ok(source.includes(title), `missing guide: ${title}`);
  assert.match(source, /DD Form 93 and SGLI are separate records in separate systems/);
  assert.match(source, /Soldiers cannot upload documents directly into their own iPERMS record/);
  assert.match(source, /Never enter SSN, bank-account data, LES details, or attachments into this public website/);
  assert.match(source, /section: "pay"/);
});

test("uses the current AESMP and AVS workflow for ARNet access", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /Request, transfer, or maintain ARNet access/);
  assert.match(source, /New Access Request in AESMP/);
  assert.match(source, /AVS replaced the routine manual DD Form 2875 routing process/);
  assert.match(source, /ATCTS was retired in 2025/);
  assert.doesNotMatch(source, /g6-request-arnet-account-aug-2023\.pdf/);
  assert.doesNotMatch(source, /\/resources\/arnet\/|legacyIntro.*ARNet/i);
});

test("provides source-verified Army AWS WickrGov onboarding", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /Set up and use Army AWS WickrGov/);
  assert.match(source, /https:\/\/go\.army\.mil\/wickr-onboard/);
  assert.match(source, /Install AWS WickrGov—not the commercial Wickr app/);
  assert.match(source, /use your @army\.mil email address/);
  assert.match(source, /Message expiration or burn-on-read does not cancel official records-retention obligations/);
  assert.match(source, /section: "access"/);
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
  assert.match(html, />Set up and use Army AWS WickrGov</i);
  assert.match(html, />Request, transfer, or maintain ARNet access</i);
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
