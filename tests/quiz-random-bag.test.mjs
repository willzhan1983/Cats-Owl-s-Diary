import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../grade-quiz.js", import.meta.url), "utf8");
const questions = [
  { id: "q1", category: "math", difficulty: "normal", question: "第一题", options: ["对", "错1", "错2", "错3"], answer: 0 },
  { id: "q2", category: "math", difficulty: "normal", question: "第二题", options: ["错", "对", "错2", "错3"], answer: 1 },
];
const storage = new Map([["catsOwlDifficulty", "normal"]]);
const context = {
  console,
  Math,
  quizBank: { first: questions, second: questions.slice() },
  randomQuiz() { return questions[0]; },
  localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value)) },
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context);

const first = context.randomQuiz("first", "level-one");
const second = context.randomQuiz("second", "level-one");
assert.notEqual(first.question, second.question, "同一关卡跨题库抽题不应立即重复");
assert.equal(second.options[second.answer], questions.find((question) => question.id === second.id).options[questions.find((question) => question.id === second.id).answer]);
assert.equal(context.quizBank.first[0].category, "math");
assert.equal(context.quizBank.first[0].difficulty, "normal");
console.log("quiz random bag test passed");
