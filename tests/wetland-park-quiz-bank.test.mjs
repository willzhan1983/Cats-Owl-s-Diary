import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../wetland-park-quiz-bank.js", import.meta.url), "utf8");
const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
let refreshCalls = 0;
const context = { quizBank: {}, levels: [{ world: "wetland_park", id: "wetland_fog_entrance", tasks: [] }], globalThis: { CATS_OWLS_REFRESH_WETLAND_PARK_QUIZ: () => { refreshCalls += 1; } }, Math };
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
assert.equal(refreshCalls, 1);
assert.match(game, /startWetlandParkChapter/);
assert.match(game, /CATS_OWLS_WETLAND_PARK_QUIZ/);
assert.match(game, /function refreshWetlandParkQuizTask\(\)/);
assert.match(game, /if \(!sourceTask \|\| state\.tasksList\.some\(\(task\) => task\.wetlandParkShared\)\) return false;/);
assert.match(game, /window\.CATS_OWLS_REFRESH_WETLAND_PARK_QUIZ = refreshWetlandParkQuizTask/);

const refreshSource = game.match(/function refreshWetlandParkQuizTask\(\) \{[\s\S]*?\n\}/)?.[0] || "";
const directLevelContext = {
  state: { levelIndex: 0, tasksList: [] },
  levels: context.levels,
  window: { CATS_OWLS_WETLAND_PARK_QUIZ: api },
  selectedDifficulty: "crazy",
  isWetlandParkLevel: () => true,
  prepareTask: (task) => ({ ...task, quiz: api.assign("wetland_fog_entrance", "crazy") }),
  updateHud: () => {},
};
vm.runInNewContext(`${refreshSource}\nrefreshResult = refreshWetlandParkQuizTask();`, directLevelContext);
assert.equal(directLevelContext.refreshResult, true);
assert.equal(directLevelContext.state.tasksList.length, 1);
assert.equal(directLevelContext.state.tasksList[0].wetlandParkShared, true);
assert.ok(directLevelContext.state.tasksList[0].quiz);
vm.runInNewContext("secondRefreshResult = refreshWetlandParkQuizTask();", directLevelContext);
assert.equal(directLevelContext.secondRefreshResult, false);
assert.equal(directLevelContext.state.tasksList.length, 1, "direct initialization must not duplicate the quiz task");
