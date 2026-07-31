import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../acorn-town-quiz-bank.js", import.meta.url), "utf8");
let randomValue = 0;
const deterministicMath = Object.create(Math);
deterministicMath.random = () => {
  randomValue = (randomValue + 0.173) % 1;
  return randomValue;
};

const context = {
  console,
  Math: deterministicMath,
  quizBank: { math: [{ difficulty: "normal", mode: "core", title: "fallback", question: "1+1?", options: ["1", "2", "3", "4"], answer: 1 }] },
  levels: [],
};
context.window = context;
context.globalThis = context;
vm.createContext(context);
vm.runInContext(source, context);

const api = context.CATS_OWLS_ACORN_TOWN_QUIZ;
const levelIds = ["acorn_post_office", "acorn_hunt", "acorn_market", "acorn_notice_board"];

api.beginRun("normal");
const firstRun = levelIds.map((levelId) => api.assign(levelId, "normal"));
const firstRunId = api.runSnapshot().id;
const firstQuestions = firstRun.flatMap((entry) => [entry.core.question, entry.bonus.question]);
assert.equal(new Set(firstQuestions).size, 8);
assert.ok(firstRun.every((entry) => entry.core.difficulty === "normal"));
assert.ok(firstRun.every((entry) => entry.bonus.difficulty === "normal"));
assert.ok(firstRun.every((entry) => entry.core.mode === "core"));
assert.ok(firstRun.every((entry) => entry.bonus.mode === "bonus"));

assert.deepEqual(api.assign("acorn_hunt", "normal"), firstRun[1]);

api.beginRun("normal");
const secondRun = levelIds.map((levelId) => api.assign(levelId, "normal"));
const secondQuestions = secondRun.flatMap((entry) => [entry.core.question, entry.bonus.question]);
assert.equal(new Set(secondQuestions).size, 8);
assert.ok(api.runSnapshot().id > firstRunId);

const hardAssignment = api.assign("acorn_post_office", "hard");
assert.equal(hardAssignment.core.difficulty, "hard");
assert.equal(hardAssignment.bonus.difficulty, "hard");
assert.equal(api.runSnapshot().difficulty, "hard");

context.quizBank[api.bonusKey] = [];
api.beginRun("easy");
assert.equal(api.assign("acorn_post_office", "easy").bonus, null);

context.quizBank[api.coreKey] = [];
api.beginRun("easy");
assert.ok(api.assign("acorn_hunt", "easy").core.question);
