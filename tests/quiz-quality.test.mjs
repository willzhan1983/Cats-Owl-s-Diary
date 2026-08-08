import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../grade-quiz.js", import.meta.url), "utf8");

function loadRuntime(questions, difficulty = "normal") {
  const storage = new Map([["catsOwlDifficulty", difficulty]]);
  const context = {
    console,
    Math: Object.create(Math),
    quizBank: questions,
    randomQuiz: () => questions.math[0],
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, String(value)),
    },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context);
  return context;
}

const context = loadRuntime({
  math: [
    { question: "一年级题", grade: 1, options: ["A", "B", "C", "D"], answer: 0 },
    { question: "三年级题", grade: 3, options: ["A", "B", "C", "D"], answer: 1 },
    { question: "四年级题", grade: 4, options: ["A", "B", "C", "D"], answer: 2 },
    { question: "六年级题", grade: 6, options: ["A", "B", "C", "D"], answer: 3 },
  ],
  legacy: [
    { difficulty: "expert", topic: "sorting", question: "旧题", options: ["A", "B", "C", "D"], answer: 0 },
  ],
});

assert.deepEqual(
  context.quizBank.math.map((question) => [question.difficulty, question.grade]),
  [["easy", 1], ["normal", 3], ["hard", 4], ["crazy", 6]],
  "年级应明确映射到四档难度",
);
assert.equal(context.quizBank.legacy[0].difficulty, "crazy", "旧 expert 难度应归一化为 crazy");
assert.equal(context.quizBank.legacy[0].category, "logic", "sorting 主题应归一化为 logic 类别");
assert.ok(context.quizBank.legacy[0].id, "旧题应补齐稳定 id");

const shared = [
  { id: "shared-1", category: "math", difficulty: "normal", question: "重复候选", options: ["正确", "错1", "错2", "错3"], answer: 0 },
  { id: "shared-2", category: "math", difficulty: "normal", question: "另一候选", options: ["错", "正确", "错2", "错3"], answer: 1 },
];
const repeatContext = loadRuntime({ first: shared, second: [shared[0], shared[1]] });
const first = repeatContext.randomQuiz("first", "level-one");
const second = repeatContext.randomQuiz("second", "level-one");
assert.notEqual(first.question, second.question, "同一关卡跨题库抽题时不应立即重复");
assert.equal(second.options[second.answer], shared.find((question) => question.id === second.id).options[shared.find((question) => question.id === second.id).answer]);

const bankFiles = [
  "grade-lower-quiz-bank.js",
  "grade-upper-quiz-bank.js",
  "moonlight-quiz-bank.js",
  "apple-valley-quiz-bank.js",
  "forest-road-quiz-bank.js",
  "mist-swamp-quiz-bank.js",
  "acorn-town-quiz-bank.js",
];
for (const file of bankFiles) assert.ok(readFileSync(new URL(`../${file}`, import.meta.url), "utf8").length > 0);

console.log("quiz quality tests passed");
