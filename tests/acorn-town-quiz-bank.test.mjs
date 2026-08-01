import assert from "node:assert/strict";
import vm from "node:vm";
import { existsSync, readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bankUrl = new URL("../acorn-town-quiz-bank.js", import.meta.url);
assert.ok(existsSync(bankUrl));

const context = {
  console,
  quizBank: { math: [{ title: "fallback", question: "1+1?", options: ["1", "2", "3", "4"], answer: 1 }] },
  levels: [],
  Math,
};
context.window = context;
context.globalThis = context;
vm.createContext(context);
vm.runInContext(readFileSync(bankUrl, "utf8"), context);

const api = context.CATS_OWLS_ACORN_TOWN_QUIZ;
const catalog = JSON.parse(JSON.stringify(api.catalog));
assert.match(index, /acorn-town-quiz-bank\.js/);
assert.equal(api.count, 48);
assert.equal(catalog.length, 48);
assert.equal(new Set(catalog.map((entry) => entry.question)).size, 48);

for (const difficulty of ["easy", "normal", "hard", "crazy"]) {
  assert.equal(catalog.filter((entry) => entry.difficulty === difficulty && entry.mode === "core").length, 8);
  assert.equal(catalog.filter((entry) => entry.difficulty === difficulty && entry.mode === "bonus").length, 4);
}

for (const entry of catalog) {
  assert.equal(entry.options.length, 4, entry.question);
  assert.equal(new Set(entry.options).size, 4, entry.question);
  assert.ok(Number.isInteger(entry.answer), entry.question);
  assert.ok(entry.answer >= 0 && entry.answer < 4, entry.question);
  assert.ok(entry.options[entry.answer], entry.question);
}

const normalQuantityRiddle = catalog.find((entry) =>
  entry.difficulty === "normal" &&
  entry.mode === "bonus" &&
  entry.options.includes("2+2")
);
assert.match(normalQuantityRiddle.question, /表示的数量不是 4/);
assert.equal(normalQuantityRiddle.options[normalQuantityRiddle.answer], "5");
