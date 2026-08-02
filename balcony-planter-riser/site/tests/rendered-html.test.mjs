import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the planter model shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Balcony planter riser — interactive model<\/title>/i);
  assert.match(html, /Interactive design model/);
  assert.match(html, /src="\/planter-stand-model\.html"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("publishes matched upper ties and both BOM destinations", async () => {
  const model = await readFile(
    new URL("../public/planter-stand-model.html", import.meta.url),
    "utf8",
  );

  assert.match(model, /TB-01 - front upper tie 760x70x35 \(non-bearing\)/);
  assert.match(model, /TB-02 - rear upper tie 760x70x35 \(non-bearing\)/);
  assert.match(model, /const joistLength=D-2\*slimT/);
  assert.match(model, /Open BOM in Google Drive/);
  assert.match(model, /Download XLSX/);
  assert.doesNotMatch(model, /id="timber"/);
});
