import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../wetland-park-quiz-bank.js", import.meta.url), "utf8");
const context = { quizBank: {}, levels: [{ world: "wetland_park", id: "wetland_fog_entrance", tasks: [] }], globalThis: {}, Math };
context.window = context.globalThis;
vm.runInNewContext(source, context);
const api = context.globalThis.CATS_OWLS_WETLAND_PARK_QUIZ;

assert.equal(api.key, "wetlandParkShared");
for (const difficulty of ["easy", "normal", "hard", "crazy"]) assert.ok(api.catalog.some((question) => question.difficulty === difficulty));
for (const question of api.catalog) {
  assert.ok(["math", "english", "language", "reading", "logic"].includes(question.category));
  assert.ok(question.options[question.answer] !== undefined);
}
assert.equal(context.levels[0].tasks.filter((task) => task.wetlandParkShared).length, 1);
