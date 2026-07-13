const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");

test("prototype is not indexed or presented as production", () => {
  assert.match(html, /noindex, nofollow/);
  assert.match(html, /не является действующим официальным сайтом/);
});

test("official destination is used without placeholder contacts", () => {
  assert.match(html, /https:\/\/koz\.ru\//);
  assert.doesNotMatch(html, /12-34-56|sales@koz\.ru|example\.com/);
});

test("fake forms and third-party generated assets are absent", () => {
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(html, /qwenlm|cdn\.tailwindcss|fonts\.googleapis/);
});
