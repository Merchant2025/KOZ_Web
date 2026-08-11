const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("css/styles.css", "utf8");

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

test("mobile navigation remains available without JavaScript", () => {
  assert.match(html, /<html[^>]*class="no-js"/i);
  assert.match(html, /<script src="js\/app\.js"><\/script>\s*<link rel="stylesheet"/i);
  assert.match(css, /\.js \.navigation\s*\{[^}]*display:none/);
  assert.doesNotMatch(css, /(?<!\.js )\.navigation\s*\{[^}]*display:none/);
});

test("menu control exposes its target and initial state", () => {
  assert.match(html, /<button[^>]*class="menu-button"[^>]*aria-expanded="false"[^>]*aria-controls="navigation"/i);
  assert.match(html, /<nav[^>]*id="navigation"[^>]*aria-label="[^"]+"/i);
});
