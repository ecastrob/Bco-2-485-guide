import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const repositoryPath = "/Bco-2-485-guide";

test("exports a GitHub Pages-ready static site", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /<title>B Co 2-485 Soldier Guide<\/title>/i);
  assert.match(html, />Home</i);
  assert.match(html, /Welcome to the B Co 2-485 Soldier Guide/i);
  assert.doesNotMatch(html, />All Guides</i);
  assert.match(html, /Created by an NCO for Reserve Soldiers\./i);
  assert.doesNotMatch(html, /Reserve Soldiers and NCOs/i);
  assert.match(html, new RegExp(`${repositoryPath}/_next/`));
  assert.match(html, new RegExp(`${repositoryPath}/favicon\\.svg`));
  assert.match(html, /https:\/\/ecastrob\.github\.io\/Bco-2-485-guide/i);
});
