const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const cheerio = require("cheerio");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("css/styles.css", "utf8");
const $ = cheerio.load(html);

function isLocalReference(reference) {
  return !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference);
}

function accessibleName(element) {
  const ariaLabel = element.attr("aria-label")?.trim();
  if (ariaLabel) return ariaLabel;

  const labelledBy = element.attr("aria-labelledby")?.trim();
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map((id) => $(`#${id}`).text().trim())
      .filter(Boolean)
      .join(" ");
  }

  return element.text().trim();
}
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

test("every local href and src resolves to a file or an id in index.html", () => {
  $("[href], [src]").each((_, element) => {
    const node = $(element);

    for (const attribute of ["href", "src"]) {
      const reference = node.attr(attribute);
      if (reference === undefined || !isLocalReference(reference)) continue;

      const [fileReference, fragment] = reference.split("#", 2);
      let resolves = false;
      if (fileReference) {
        const pathname = fileReference.split(/[?]/, 1)[0];
        const localPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
        const targetPath = path.resolve(localPath || "index.html");
        assert.ok(
          fs.existsSync(targetPath) && fs.statSync(targetPath).isFile(),
          `${attribute}="${reference}" must point to an existing local file`,
        );
        resolves = true;
      }

      if (fragment) {
        const id = decodeURIComponent(fragment);
        assert.equal(
          $("[id]").filter((_, candidate) => $(candidate).attr("id") === id).length,
          1,
          `${attribute}="${reference}" must point to exactly one id in index.html`,
        );
        resolves = true;
      }

      assert.ok(resolves, `${attribute}="${reference}" must not be an empty local reference`);
    }
  });
});

test("menu button has a valid accessible initial state", () => {
  const menuButton = $(".menu-button");
  assert.equal(menuButton.length, 1, "the page must have one menu button");
  assert.ok(accessibleName(menuButton), "the menu button must have an accessible name");

  const controlledIds = menuButton.attr("aria-controls")?.trim().split(/\s+/).filter(Boolean);
  assert.ok(controlledIds?.length, "the menu button must declare aria-controls");
  for (const id of controlledIds) {
    assert.equal($(`[id="${id}"]`).length, 1, `aria-controls must reference #${id}`);
  }

  const navigation = $(`[id="${controlledIds[0]}"]`);
  assert.equal(menuButton.attr("aria-expanded"), "false");
  assert.ok(!navigation.hasClass("open"), "collapsed navigation must not have the open class");
});

test("mobile navigation remains available without JavaScript", () => {
  assert.match(html, /<html[^>]*class="no-js"/i);
  assert.match(html, /<script src="js\/app\.js"><\/script>\s*<link rel="stylesheet"/i);
  assert.match(css, /\.js \.navigation\s*\{[^}]*display:none/);
  assert.doesNotMatch(css, /(?<!\.js )\.navigation\s*\{[^}]*display:none/);
});
