import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(SCRIPT_DIR, "..");

function readProjectFile(path) {
  return readFileSync(resolve(PROJECT_DIR, path), "utf8");
}

test("a published cover always wins over the designed cover fallback", () => {
  const viewer = readProjectFile("components/library/BookViewer3D.tsx");

  assert.match(
    viewer,
    /showDesignedCover=\{!meta\.cover && !!meta\.coverBlurb\}/,
    "The detail viewer must keep the real cover when a localized cover note exists",
  );
  assert.doesNotMatch(
    viewer,
    /showDesignedCover=\{!!meta\.coverBlurb\}/,
    "A cover note must never replace a published cover image",
  );
});

test("all nine library books point to unique, decodable WebP cover derivatives", () => {
  const booksSource = readProjectFile("data/books.ts");
  const libraryStart = booksSource.indexOf("export const LIBRARY_BOOKS");
  assert.ok(libraryStart >= 0, "Missing LIBRARY_BOOKS data");

  const librarySource = booksSource.slice(libraryStart);
  const coverPaths = [...librarySource.matchAll(/^\s+cover: "([^"]+)",/gm)]
    .map((match) => match[1]);
  const coverAspects = [...librarySource.matchAll(/^\s+coverAspect: ([^,]+),/gm)];

  assert.equal(coverPaths.length, 9, "Every library book needs one front cover");
  assert.equal(new Set(coverPaths).size, 9, "Front-cover assets must not be reused");
  assert.equal(coverAspects.length, 9, "Every 3D book needs its published aspect ratio");

  for (const publicPath of coverPaths) {
    assert.match(publicPath, /^\/books\/rendered\/.+\.webp$/);
    const localPath = resolve(PROJECT_DIR, "public", publicPath.slice(1));
    assert.ok(existsSync(localPath), `Missing published cover: ${publicPath}`);

    const bytes = readFileSync(localPath);
    assert.ok(bytes.length >= 20_000, `Cover is unexpectedly small: ${publicPath}`);
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", `${publicPath} is not RIFF WebP`);
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", `${publicPath} is not WebP`);
  }
});

test("3D and reader surfaces preserve each edition's full cover ratio", () => {
  const book3d = readProjectFile("components/library/Book3D.tsx");
  const readerStyles = readProjectFile("app/globals.css");

  assert.match(book3d, /height \* meta\.coverAspect/);
  assert.match(
    readerStyles,
    /\.flip-leaf-cover \.leaf-cover-img\s*\{[^}]*object-fit:\s*contain;/s,
    "The flipbook must not crop titles, author names, or publisher marks",
  );
});
