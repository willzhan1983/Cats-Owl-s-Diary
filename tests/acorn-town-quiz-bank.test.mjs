import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const bankUrl = new URL("../acorn-town-quiz-bank.js", import.meta.url);

assert.ok(existsSync(bankUrl), "Acorn Town quiz bank should exist");
const bank = readFileSync(bankUrl, "utf8");

assert.match(index, /<script src="\.\/acorn-town-quiz-bank\.js\?v=acorn-town-20260729"><\/script>/);
assert.equal((bank.match(/difficulty: "easy"/g) || []).length, 6);
assert.equal((bank.match(/difficulty: "normal"/g) || []).length, 6);
assert.equal((bank.match(/difficulty: "hard"/g) || []).length, 6);
assert.equal((bank.match(/difficulty: "crazy"/g) || []).length, 6);
assert.equal((bank.match(/requiresCoreTasks: true/g) || []).length, 1);
for (const level of ["橡果镇邮局", "寻找丢失的橡果", "橡果集市兑换", "小镇公告板"]) {
  assert.match(bank, new RegExp(`level: "${level}"`));
}
