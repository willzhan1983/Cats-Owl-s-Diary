import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../grade-quiz.js", import.meta.url), "utf8");
const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");

function loadQuizRuntime() {
  const questions = [
    { id: "q1", difficulty: "normal", question: "第一题", options: ["正确一", "错一", "错二", "错三"], answer: 0 },
    { id: "q2", difficulty: "normal", question: "第二题", options: ["错一", "正确二", "错二", "错三"], answer: 1 },
    { id: "q3", difficulty: "normal", question: "第三题", options: ["错一", "错二", "正确三", "错三"], answer: 2 },
  ];
  const testMath = Object.create(Math);
  testMath.random = () => 0;
  const storage = new Map([["catsOwlDifficulty", "normal"]]);
  const context = {
    console,
    Math: testMath,
    quizBank: { shared: questions, math: [questions[0]] },
    randomQuiz: () => questions[0],
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, String(value)),
    },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context);
  return { context, questions };
}

const { context, questions } = loadQuizRuntime();
const originalBank = JSON.parse(JSON.stringify(questions));
const picks = Array.from({ length: 4 }, () => context.randomQuiz("shared", "map-one"));

assert.equal(new Set(picks.slice(0, 3).map((quiz) => quiz.id)).size, 3, "同一地图应先抽完当前难度题目再重复");
assert.notEqual(picks[3].id, picks[2].id, "题库重新装袋后不应立刻重复上一题");

for (const quiz of picks) {
  const original = questions.find((question) => question.id === quiz.id);
  assert.notDeepEqual(Array.from(quiz.options), original.options, "每次出题都应打乱 ABCD 选项顺序");
  assert.equal(quiz.options[quiz.answer], original.options[original.answer], "选项打乱后正确答案必须保持不变");
}

assert.deepEqual(questions, originalBank, "随机出题不能修改共享题库原数据");
assert.ok(
  index.indexOf("./grade-quiz.js") > index.indexOf("./mist-swamp-quiz-bank.js"),
  "统一随机逻辑应在所有附加题库加载后安装"
);

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
assert.match(game, /randomQuiz\(task\.quizKey, level\.id \|\| level\.bg \|\| level\.name\)/, "出题时应传入当前地图标识");
