# Acorn Town Difficulty and Quiz Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all four Acorn Town levels scale from one slow vehicle to four fast vehicles by difficulty, expand the quiz bank to 48 difficulty-tagged questions, and guarantee unique required and bonus questions across one four-level chapter run.

**Architecture:** Keep the enhancement isolated to the existing Acorn Town rules, level data, quiz module, and runtime branches. Store immutable difficulty values in `acorn-town-rules.js`, use four route templates per level in `game.js`, and let `acorn-town-quiz-bank.js` own a chapter-run shuffle bag with stable per-level assignments.

**Tech Stack:** Vanilla JavaScript, HTML5 Canvas, browser globals, Node.js test runner, `node:vm`.

## Global Constraints

- Do not add an NPC quest, NPC following, staged NPC task card, or NPC hand-in flow.
- Do not change any non-Acorn Town level behavior.
- Do not add or modify art assets.
- Every Acorn Town level must have exactly 1, 2, 3, or 4 active vehicles on Easy, Normal, Hard, or Crazy.
- Active vehicle speeds must be exactly 48, 64, 80, or 96 pixels per second.
- Vehicle collision applies the existing obstacle time penalty and knockback, but never removes hearts or inventory.
- The final quiz catalog must contain exactly 48 unique questions: 8 required and 4 bonus questions for each difficulty.
- One Acorn Town run must assign eight distinct questions across its four levels.
- Restarting the same level must reuse its assigned required and bonus questions.
- Required-question mistakes retain the existing heart and time penalties.
- Bonus-question mistakes apply no heart or time penalty and never block completion.
- Missing question data must use a safe fallback instead of blocking the level.
- Preserve all existing resource fallbacks and current Acorn Town unlock behavior.

---

### Task 1: Centralize Acorn Town Traffic and Bonus Rules

**Files:**
- Modify: `acorn-town-rules.js:1-45`
- Test: `tests/acorn-town-rules.test.mjs`

**Interfaces:**
- Consumes: difficulty names `easy`, `normal`, `hard`, and `crazy`.
- Produces: `trafficFor(mode) -> { count: number, speed: number }` and `bonusPoints() -> 10` on `CATS_OWLS_ACORN_TOWN_RULES`.

- [ ] **Step 1: Add failing rule assertions**

Append these assertions to `tests/acorn-town-rules.test.mjs`:

```js
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((mode) => rules.trafficFor(mode)),
  [
    { count: 1, speed: 48 },
    { count: 2, speed: 64 },
    { count: 3, speed: 80 },
    { count: 4, speed: 96 },
  ]
);
assert.deepEqual(rules.trafficFor("unknown"), { count: 2, speed: 64 });
assert.equal(rules.bonusPoints(), 10);
```

- [ ] **Step 2: Run the rule test and verify the new assertions fail**

Run:

```bash
node --test tests/acorn-town-rules.test.mjs
```

Expected: FAIL because `rules.trafficFor` and `rules.bonusPoints` do not exist.

- [ ] **Step 3: Add the immutable traffic table and accessors**

Add this data next to `WRONG_ACTION_PENALTIES` in `acorn-town-rules.js`:

```js
const TRAFFIC = Object.freeze({
  easy: Object.freeze({ count: 1, speed: 48 }),
  normal: Object.freeze({ count: 2, speed: 64 }),
  hard: Object.freeze({ count: 3, speed: 80 }),
  crazy: Object.freeze({ count: 4, speed: 96 }),
});
const BONUS_POINTS = 10;
```

Add these functions before `coreTasksDone`:

```js
function trafficFor(mode) {
  const traffic = TRAFFIC[mode] || TRAFFIC.normal;
  return { count: traffic.count, speed: traffic.speed };
}

function bonusPoints() {
  return BONUS_POINTS;
}
```

Expose both functions in `CATS_OWLS_ACORN_TOWN_RULES`:

```js
trafficFor,
bonusPoints,
```

- [ ] **Step 4: Run the rule test and verify it passes**

Run:

```bash
node --test tests/acorn-town-rules.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the rules**

```bash
git add acorn-town-rules.js tests/acorn-town-rules.test.mjs
git commit -m "feat: add Acorn Town traffic difficulty rules"
```

---

### Task 2: Scale Vehicle Routes, Speed, and Collision Penalties

**Files:**
- Modify: `game.js:1565-1705`
- Modify: `game.js:1745-1765`
- Modify: `game.js:3455-3480`
- Test: `tests/acorn-town-runtime.test.mjs`

**Interfaces:**
- Consumes: `CATS_OWLS_ACORN_TOWN_RULES.trafficFor(selectedDifficulty)`.
- Produces: `prepareAcornTownLevel(level).townCarts` with exact count and speed for the selected difficulty.
- Preserves: `updateTownCarts(dt)` and the one-second `townCartCooldownUntil`.

- [ ] **Step 1: Extend the runtime matrix with speed and exact vehicle counts**

In the matrix result inside `tests/acorn-town-runtime.test.mjs`, add:

```js
cartSpeeds: [...new Set(state.townCarts.map((cart) => cart.speed))],
```

Replace the existing market and notice-board vehicle assertions and add post-office and hunt assertions:

```js
assert.deepEqual(row("normal", "acorn_post_office"), {
  difficulty: "normal", levelId: "acorn_post_office", time: 110, realAcorns: 0, fakeAcorns: 0,
  letters: 3, fakeFragments: 0, mailboxes: 3, decoyMailboxes: 0, blockers: 0, orders: 0,
  carts: 2, cartSpeeds: [64], basketNeed: 0, quizzes: 1,
});
assert.deepEqual(row("crazy", "acorn_post_office"), {
  difficulty: "crazy", levelId: "acorn_post_office", time: 80, realAcorns: 0, fakeAcorns: 0,
  letters: 5, fakeFragments: 0, mailboxes: 5, decoyMailboxes: 2, blockers: 0, orders: 0,
  carts: 4, cartSpeeds: [96], basketNeed: 0, quizzes: 1,
});
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_post_office");
    return [entry.carts, entry.cartSpeeds];
  }),
  [[1, [48]], [2, [64]], [3, [80]], [4, [96]]]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_hunt");
    return [entry.carts, entry.cartSpeeds];
  }),
  [[1, [48]], [2, [64]], [3, [80]], [4, [96]]]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_market");
    return [entry.carts, entry.cartSpeeds];
  }),
  [[1, [48]], [2, [64]], [3, [80]], [4, [96]]]
);
assert.deepEqual(
  ["easy", "normal", "hard", "crazy"].map((difficulty) => {
    const entry = row(difficulty, "acorn_notice_board");
    return [entry.carts, entry.cartSpeeds];
  }),
  [[1, [48]], [2, [64]], [3, [80]], [4, [96]]]
);
```

Replace the single Crazy collision probe with a four-difficulty probe:

```js
const trafficCollisions = [];
for (const difficulty of ["easy", "normal", "hard", "crazy"]) {
  selectedDifficulty = difficulty;
  resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
  state.time = 100;
  state.hearts = 3;
  state.inventory.push("acornLetterRuru");
  const cart = state.townCarts[0];
  cart.x = state.player.x;
  cart.y = state.player.y;
  updateTownCarts(0);
  const afterFirstHit = state.time;
  updateTownCarts(0);
  trafficCollisions.push({
    difficulty,
    time: afterFirstHit,
    cooldownTime: state.time,
    hearts: state.hearts,
    inventory: [...state.inventory],
  });
}
```

Return `trafficCollisions` from the behavior IIFE and remove its old `cartTime` property.

Assert:

```js
assert.deepEqual(plain(behavior.trafficCollisions), [
  { difficulty: "easy", time: 100, cooldownTime: 100, hearts: 3, inventory: ["acornLetterRuru"] },
  { difficulty: "normal", time: 98, cooldownTime: 98, hearts: 3, inventory: ["acornLetterRuru"] },
  { difficulty: "hard", time: 96, cooldownTime: 96, hearts: 3, inventory: ["acornLetterRuru"] },
  { difficulty: "crazy", time: 94, cooldownTime: 94, hearts: 3, inventory: ["acornLetterRuru"] },
]);
```

- [ ] **Step 2: Run the runtime test and verify it fails**

Run:

```bash
node --test tests/acorn-town-runtime.test.mjs
```

Expected: FAIL because Easy currently has zero vehicles, the hunt has no vehicles, counts stop at two, and collision penalties are `0/0/3/5`.

- [ ] **Step 3: Replace every Acorn Town `townCarts` array with four route templates**

Use these exact arrays in the four level records:

```js
// acorn_post_office
townCarts: [
  { x: 220, y: 282, minX: 220, maxX: 690, dir: 1 },
  { x: 840, y: 350, minX: 120, maxX: 840, dir: -1 },
  { x: 240, y: 420, minX: 240, maxX: 700, dir: 1 },
  { x: 900, y: 250, minX: 420, maxX: 900, dir: -1 },
],

// acorn_hunt
townCarts: [
  { x: 180, y: 310, minX: 180, maxX: 760, dir: 1 },
  { x: 720, y: 430, minX: 260, maxX: 720, dir: -1 },
  { x: 340, y: 280, minX: 340, maxX: 880, dir: 1 },
  { x: 660, y: 390, minX: 210, maxX: 660, dir: -1 },
],

// acorn_market
townCarts: [
  { x: 190, y: 300, minX: 190, maxX: 760, dir: 1 },
  { x: 820, y: 360, minX: 260, maxX: 820, dir: -1 },
  { x: 320, y: 430, minX: 320, maxX: 880, dir: 1 },
  { x: 900, y: 250, minX: 420, maxX: 900, dir: -1 },
],

// acorn_notice_board
townCarts: [
  { x: 200, y: 180, minX: 200, maxX: 720, dir: 1 },
  { x: 840, y: 440, minX: 280, maxX: 840, dir: -1 },
  { x: 240, y: 380, minX: 240, maxX: 600, dir: 1 },
  { x: 900, y: 280, minX: 380, maxX: 900, dir: -1 },
],
```

- [ ] **Step 4: Apply traffic count and speed during level preparation**

In `prepareAcornTownLevel`, add:

```js
const traffic = CATS_OWLS_ACORN_TOWN_RULES.trafficFor(selectedDifficulty);
```

Replace the existing `townCarts` preparation with:

```js
townCarts: (level.townCarts || [])
  .slice(0, traffic.count)
  .map((cart) => ({ ...cart, speed: traffic.speed })),
```

- [ ] **Step 5: Separate traffic collision penalties from wrong-action penalties**

Add this function immediately before `updateTownCarts`:

```js
function applyAcornTownTrafficCollision(cart) {
  state.obstacleHits += 1;
  const amount = applyTimePenalty("obstacle", cart.x, cart.y);
  messageEl.textContent = amount
    ? `小推车经过，扣除 ${amount} 秒，先让一让。`
    : "小推车经过，先让一让。";
  state.shake = Math.max(state.shake, 0.12);
  return amount;
}
```

In `updateTownCarts`, replace:

```js
applyAcornTownWrongAction(cart.x, cart.y, "小推车经过，先让一让。");
```

with:

```js
applyAcornTownTrafficCollision(cart);
```

Keep the existing knockback and cooldown lines unchanged.

- [ ] **Step 6: Add route safety assertions**

After the runtime matrix, add:

```js
const routeSafety = vm.runInContext(`
  (() => {
    selectedDifficulty = "crazy";
    return levels
      .filter((level) => level.world === "acorn_town")
      .map((level) => {
        const prepared = prepareAcornTownLevel(level);
        return {
          levelId: level.id,
          insideBounds: prepared.townCarts.every((cart) =>
            cart.minX >= 28 && cart.maxX <= 932 && cart.y >= 80 && cart.y <= 460
          ),
          startSafe: prepared.townCarts.every((cart) =>
            Math.hypot(cart.x - level.start.x, cart.y - level.start.y) >= 72
          ),
          reversalsSafe: prepared.townCarts.every((cart) =>
            prepared.tasks
              .filter((task) => !task.optional)
              .every((task) =>
                Math.hypot(cart.minX - task.x, cart.y - task.y) >= 56 &&
                Math.hypot(cart.maxX - task.x, cart.y - task.y) >= 56
              )
          ),
        };
      });
  })();
`, runtime);

assert.ok(plain(routeSafety).every((entry) =>
  entry.insideBounds && entry.startSafe && entry.reversalsSafe
));
```

- [ ] **Step 7: Run Acorn Town runtime tests**

Run:

```bash
node --test tests/acorn-town-runtime.test.mjs tests/acorn-town-mechanics.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit traffic scaling**

```bash
git add game.js tests/acorn-town-runtime.test.mjs
git commit -m "feat: scale Acorn Town traffic by difficulty"
```

---

### Task 3: Expand and Validate the 48-question Catalog

**Files:**
- Modify: `acorn-town-quiz-bank.js:1-95`
- Modify: `tests/acorn-town-quiz-bank.test.mjs`

**Interfaces:**
- Consumes: the existing 24 question records.
- Produces: `CATS_OWLS_ACORN_TOWN_QUIZ.catalog`, `coreKey`, `bonusKey`, and `count`.
- Catalog record: `{ difficulty, mode, title, question, options, answer }`.

- [ ] **Step 1: Replace source-count tests with catalog validation**

Replace `tests/acorn-town-quiz-bank.test.mjs` with a VM-backed test:

```js
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
```

- [ ] **Step 2: Run the catalog test and verify it fails**

Run:

```bash
node --test tests/acorn-town-quiz-bank.test.mjs
```

Expected: FAIL because the current API does not expose `catalog` and only contains 24 questions.

- [ ] **Step 3: Tag all existing records as required questions**

Add `mode: "core"` to each of the existing 24 records.

Rename:

```js
const acornTownQuestions = [
```

to:

```js
const existingCoreQuestions = [
```

- [ ] **Step 4: Add two new required questions per difficulty**

Add these exact eight records:

```js
const additionalCoreQuestions = [
  { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "一辆小推车开来时，最安全的做法是？", options: ["先停下并让车通过", "站在车道中间", "追着小车跑", "闭眼向前走"], answer: 0 },
  { difficulty: "easy", mode: "core", title: "橡果镇基础题", question: "3 封信送完 1 封，还剩几封？", options: ["1", "2", "3", "4"], answer: 1 },
  { difficulty: "normal", mode: "core", title: "橡果镇普通题", question: "每个篮子放 3 颗橡果，2 个篮子共放几颗？", options: ["5", "6", "7", "8"], answer: 1 },
  { difficulty: "normal", mode: "core", title: "Acorn Town Quiz", question: "Which word means “码头”?", options: ["dock", "letter", "market", "forest"], answer: 0 },
  { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "12 颗橡果平均放进 3 个篮子，每篮几颗？", options: ["3", "4", "5", "6"], answer: 1 },
  { difficulty: "hard", mode: "core", title: "橡果镇困难题", question: "先向右走 2 格，再向上走 1 格，最后向右走 2 格，一共走几格？", options: ["4", "5", "6", "7"], answer: 1 },
  { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "4 辆车每辆间隔 3 秒通过，第一辆通过后到第四辆通过共间隔几秒？", options: ["6", "9", "12", "15"], answer: 1 },
  { difficulty: "crazy", mode: "core", title: "橡果镇综合挑战", question: "订单要 8 颗橡果，已有 3 颗，又找到 2 颗，还缺几颗？", options: ["2", "3", "4", "5"], answer: 1 },
];
```

- [ ] **Step 5: Add four bonus riddles per difficulty**

Add these exact 16 records:

```js
const bonusQuestions = [
  { difficulty: "easy", mode: "bonus", title: "奖励谜题", question: "小小果实穿棕衣，松鼠见了最欢喜。它是什么？", options: ["橡果", "石头", "信封", "树叶"], answer: 0 },
  { difficulty: "easy", mode: "bonus", title: "奖励谜题", question: "有门没有房，信件肚里藏。它是什么？", options: ["邮箱", "果篮", "路牌", "小桥"], answer: 0 },
  { difficulty: "easy", mode: "bonus", title: "奖励谜题", question: "四四方方一张纸，写好名字去旅行。它是什么？", options: ["信件", "苹果", "车轮", "橡果"], answer: 0 },
  { difficulty: "easy", mode: "bonus", title: "奖励谜题", question: "站在路边不说话，箭头帮你指方向。它是什么？", options: ["路牌", "邮箱", "篮子", "叶子"], answer: 0 },
  { difficulty: "normal", mode: "bonus", title: "奖励谜题", question: "什么东西越分享，大家拥有得越多？", options: ["快乐", "石头", "空盒", "泥巴"], answer: 0 },
  { difficulty: "normal", mode: "bonus", title: "奖励谜题", question: "什么“车”不在路上跑，只在电脑里帮你装商品？", options: ["购物车图标", "火车", "汽车", "自行车"], answer: 0 },
  { difficulty: "normal", mode: "bonus", title: "奖励谜题", question: "一条路有三个箭头：右、上、右。第二个箭头指向哪里？", options: ["上", "下", "左", "右"], answer: 0 },
  { difficulty: "normal", mode: "bonus", title: "奖励谜题", question: "两颗橡果加两颗橡果，哪一个选项不是总数？", options: ["5", "4", "四", "2+2"], answer: 0 },
  { difficulty: "hard", mode: "bonus", title: "奖励谜题", question: "我不是鸟，却能带着消息飞到朋友手里。我是什么？", options: ["信件", "橡果", "小车", "路灯"], answer: 0 },
  { difficulty: "hard", mode: "bonus", title: "奖励谜题", question: "一张四方纸剪掉一个角，新的图形一共有几个角？", options: ["5", "3", "4", "2"], answer: 0 },
  { difficulty: "hard", mode: "bonus", title: "奖励谜题", question: "一辆车从左向右开，掉头后方向是什么？", options: ["从右向左", "继续向右", "向上", "不移动"], answer: 0 },
  { difficulty: "hard", mode: "bonus", title: "奖励谜题", question: "3 个订单各用 2 颗橡果，再退回 1 颗，实际用了几颗？", options: ["5", "6", "4", "7"], answer: 0 },
  { difficulty: "crazy", mode: "bonus", title: "奖励谜题", question: "四辆车依次编号 1、2、3、4，奇数车向右，哪两辆向右？", options: ["1 和 3", "2 和 4", "1 和 2", "3 和 4"], answer: 0 },
  { difficulty: "crazy", mode: "bonus", title: "奖励谜题", question: "路线右、上、右倒着读是什么？", options: ["右、上、右", "左、下、左", "上、右、右", "右、右、上"], answer: 0 },
  { difficulty: "crazy", mode: "bonus", title: "奖励谜题", question: "8 颗橡果拿走一半，再放回 1 颗，现在有几颗？", options: ["5", "4", "6", "3"], answer: 0 },
  { difficulty: "crazy", mode: "bonus", title: "奖励谜题", question: "甲车比乙车快，乙车比丙车快，哪辆最慢？", options: ["丙车", "乙车", "甲车", "一样快"], answer: 0 },
];
```

- [ ] **Step 6: Publish separate core and bonus pools**

Build the catalog and append it to two keys:

```js
const ACORN_TOWN_CORE_KEY = "acornTownCore";
const ACORN_TOWN_BONUS_KEY = "acornTownBonus";
const catalog = [...existingCoreQuestions, ...additionalCoreQuestions, ...bonusQuestions];
const coreQuestions = catalog.filter((entry) => entry.mode === "core");
const bonusPool = catalog.filter((entry) => entry.mode === "bonus");

appendUniqueQuestions(ACORN_TOWN_CORE_KEY, coreQuestions);
appendUniqueQuestions(ACORN_TOWN_BONUS_KEY, bonusPool);
```

Change the task's `quizKey` to `ACORN_TOWN_CORE_KEY`.

Expose:

```js
window.CATS_OWLS_ACORN_TOWN_QUIZ = {
  coreKey: ACORN_TOWN_CORE_KEY,
  bonusKey: ACORN_TOWN_BONUS_KEY,
  count: catalog.length,
  catalog: Object.freeze(catalog.map((entry) => Object.freeze({
    ...entry,
    options: Object.freeze([...entry.options]),
  }))),
};
```

- [ ] **Step 7: Run the catalog test**

Run:

```bash
node --test tests/acorn-town-quiz-bank.test.mjs
```

Expected: PASS with 48 unique validated questions.

- [ ] **Step 8: Commit the expanded catalog**

```bash
git add acorn-town-quiz-bank.js tests/acorn-town-quiz-bank.test.mjs
git commit -m "feat: expand Acorn Town quiz catalog"
```

---

### Task 4: Add Stable Chapter-run Quiz Assignments

**Files:**
- Modify: `acorn-town-quiz-bank.js`
- Modify: `game.js:1745-1765`
- Modify: `game.js:2125-2205`
- Create: `tests/acorn-town-quiz-run.test.mjs`

**Interfaces:**
- Produces: `beginRun(difficulty)`, `assign(levelId, difficulty) -> { core, bonus }`, and `runSnapshot()` on `CATS_OWLS_ACORN_TOWN_QUIZ`.
- `prepareTask` stores the returned records as `task.quiz` and `task.bonusQuiz`.
- A repeated `assign` call for the same run, difficulty, and level returns the same records.

- [ ] **Step 1: Write a failing shuffle-bag test**

Create `tests/acorn-town-quiz-run.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the shuffle-bag test and verify it fails**

Run:

```bash
node --test tests/acorn-town-quiz-run.test.mjs
```

Expected: FAIL because `beginRun`, `assign`, and `runSnapshot` do not exist.

- [ ] **Step 3: Implement the chapter-run state**

Add these helpers after the catalog is built in `acorn-town-quiz-bank.js`:

```js
const runState = {
  id: 0,
  difficulty: null,
  bags: { core: [], bonus: [] },
  assignments: new Map(),
};

function shuffled(list) {
  const copy = list.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function cloneQuestion(question) {
  if (!question) return null;
  return { ...question, options: [...question.options] };
}

function shuffleOptions(question) {
  if (!question?.options?.length) return cloneQuestion(question);
  const indexed = question.options.map((option, index) => ({ option, index }));
  const options = shuffled(indexed);
  return {
    ...question,
    options: options.map((entry) => entry.option),
    answer: options.findIndex((entry) => entry.index === question.answer),
  };
}

function poolFor(difficulty, mode) {
  const key = mode === "bonus" ? ACORN_TOWN_BONUS_KEY : ACORN_TOWN_CORE_KEY;
  return (quizBank[key] || []).filter((entry) =>
    entry.difficulty === difficulty && entry.mode === mode
  );
}

function beginRun(difficulty = "normal") {
  const normalized = ["easy", "normal", "hard", "crazy"].includes(difficulty) ? difficulty : "normal";
  runState.id += 1;
  runState.difficulty = normalized;
  runState.bags = {
    core: shuffled(poolFor(normalized, "core")),
    bonus: shuffled(poolFor(normalized, "bonus")),
  };
  runState.assignments.clear();
  return runState.id;
}

function safeFallback(mode) {
  if (mode === "bonus") return null;
  const preferred = catalog.find((entry) =>
    entry.difficulty === runState.difficulty && entry.mode === mode
  );
  return shuffleOptions(preferred || quizBank.math?.[0]);
}

function draw(mode) {
  const question = runState.bags[mode]?.pop();
  return shuffleOptions(question) || safeFallback(mode);
}

function assign(levelId, difficulty = "normal") {
  if (runState.difficulty !== difficulty) beginRun(difficulty);
  const key = `${runState.id}:${runState.difficulty}:${levelId}`;
  if (!runState.assignments.has(key)) {
    runState.assignments.set(key, {
      core: draw("core"),
      bonus: draw("bonus"),
    });
  }
  const assignment = runState.assignments.get(key);
  return {
    core: cloneQuestion(assignment.core),
    bonus: cloneQuestion(assignment.bonus),
  };
}

function runSnapshot() {
  return {
    id: runState.id,
    difficulty: runState.difficulty,
    assignedLevels: runState.assignments.size,
    remainingCore: runState.bags.core.length,
    remainingBonus: runState.bags.bonus.length,
  };
}
```

Expose `beginRun`, `assign`, and `runSnapshot` on `CATS_OWLS_ACORN_TOWN_QUIZ`.

- [ ] **Step 4: Begin a run only when entering Acorn Town from another world**

At the beginning of `resetGame`, before `prepareAcornTownLevel`, use:

```js
const rawLevel = levels[levelIndex];
const previousWorld = state ? levels[state.levelIndex]?.world : null;
const acornQuizApi = window.CATS_OWLS_ACORN_TOWN_QUIZ;
if (
  rawLevel?.world === "acorn_town" &&
  previousWorld !== "acorn_town" &&
  typeof acornQuizApi?.beginRun === "function"
) {
  acornQuizApi.beginRun(selectedDifficulty);
}
const level = prepareAcornTownLevel(rawLevel);
```

Remove the original single line:

```js
const level = prepareAcornTownLevel(levels[levelIndex]);
```

- [ ] **Step 5: Attach stable required and bonus assignments during task preparation**

In `prepareTask`, replace the current quiz assignment block with:

```js
if (
  task.acornTownShared &&
  level.world === "acorn_town" &&
  typeof window.CATS_OWLS_ACORN_TOWN_QUIZ?.assign === "function"
) {
  const assignment = window.CATS_OWLS_ACORN_TOWN_QUIZ.assign(level.id, selectedDifficulty);
  task.quiz = assignment.core;
  task.bonusQuiz = assignment.bonus;
} else if (task.quizKey) {
  task.quiz = randomQuiz(task.quizKey, quizScope);
}
```

- [ ] **Step 6: Run the focused and existing quiz tests**

Run:

```bash
node --test tests/acorn-town-quiz-run.test.mjs tests/acorn-town-quiz-bank.test.mjs tests/acorn-town-runtime.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit stable assignments**

```bash
git add game.js acorn-town-quiz-bank.js tests/acorn-town-quiz-run.test.mjs
git commit -m "feat: prevent repeated Acorn Town questions"
```

---

### Task 5: Add the Optional Bonus-riddle Flow

**Files:**
- Modify: `game.js:2125-2205`
- Modify: `game.js:4375-4450`
- Modify: `game.js:2870-2885`
- Test: `tests/acorn-town-runtime.test.mjs`

**Interfaces:**
- Consumes: `task.bonusQuiz` and `CATS_OWLS_ACORN_TOWN_RULES.bonusPoints()`.
- Produces: `state.acornBonusStatus` with `none`, `offered`, `answering`, or `resolved`.
- Produces: `showAcornTownBonusChoice(task)`, `openAcornTownBonusQuiz(task)`, and `skipAcornTownBonus()`.

- [ ] **Step 1: Add failing runtime probes for offer, skip, correct, and wrong paths**

Add a new VM probe to `tests/acorn-town-runtime.test.mjs`:

```js
const bonusFlow = vm.runInContext(`
  (() => {
    selectedDifficulty = "normal";
    resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
    const task = state.tasksList.find((entry) => entry.acornTownShared);
    state.tasksList.filter((entry) => entry !== task && !entry.optional).forEach((entry) => { entry.done = true; });
    const startTime = state.time;
    answerQuiz(task, task.quiz.answer);
    const offered = {
      taskDone: task.done,
      status: state.acornBonusStatus,
      canSettle: canSettleCurrentLevel(requiredTasksForCurrentLevel()),
    };
    skipAcornTownBonus();
    const skipped = {
      status: state.acornBonusStatus,
      canSettle: canSettleCurrentLevel(requiredTasksForCurrentLevel()),
      time: state.time,
    };

    resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
    const correctTask = state.tasksList.find((entry) => entry.acornTownShared);
    state.tasksList.filter((entry) => entry !== correctTask && !entry.optional).forEach((entry) => { entry.done = true; });
    answerQuiz(correctTask, correctTask.quiz.answer);
    openAcornTownBonusQuiz(correctTask);
    const beforeBonusPoints = state.runPoints;
    answerQuiz(correctTask, correctTask.bonusQuiz.answer, "bonus");
    const correct = {
      status: state.acornBonusStatus,
      gained: state.runPoints - beforeBonusPoints,
      time: state.time,
    };

    resetGame(levels.findIndex((level) => level.id === "acorn_post_office"));
    const wrongTask = state.tasksList.find((entry) => entry.acornTownShared);
    state.tasksList.filter((entry) => entry !== wrongTask && !entry.optional).forEach((entry) => { entry.done = true; });
    answerQuiz(wrongTask, wrongTask.quiz.answer);
    openAcornTownBonusQuiz(wrongTask);
    const beforeWrong = { time: state.time, hearts: state.hearts };
    const wrongIndex = (wrongTask.bonusQuiz.answer + 1) % wrongTask.bonusQuiz.options.length;
    answerQuiz(wrongTask, wrongIndex, "bonus");
    const wrong = {
      status: state.acornBonusStatus,
      time: state.time,
      hearts: state.hearts,
      beforeWrong,
    };

    return { startTime, offered, skipped, correct, wrong };
  })();
`, runtime);

assert.deepEqual(plain(bonusFlow.offered), {
  taskDone: true,
  status: "offered",
  canSettle: false,
});
assert.deepEqual(plain(bonusFlow.skipped), {
  status: "resolved",
  canSettle: true,
  time: bonusFlow.startTime,
});
assert.equal(bonusFlow.correct.status, "resolved");
assert.equal(bonusFlow.correct.gained, 10);
assert.equal(bonusFlow.wrong.status, "resolved");
assert.equal(bonusFlow.wrong.time, bonusFlow.wrong.beforeWrong.time);
assert.equal(bonusFlow.wrong.hearts, bonusFlow.wrong.beforeWrong.hearts);
```

- [ ] **Step 2: Run the runtime test and verify the bonus probe fails**

Run:

```bash
node --test tests/acorn-town-runtime.test.mjs
```

Expected: FAIL because `acornBonusStatus`, `skipAcornTownBonus`, and `openAcornTownBonusQuiz` do not exist.

- [ ] **Step 3: Initialize bonus state**

Add this field to the state object in `resetGame`:

```js
acornBonusStatus: "none",
```

- [ ] **Step 4: Extract one quiz renderer**

Add:

```js
function renderQuizQuestion(task, quiz, mode = "core") {
  if (!quiz) return false;
  quizTitle.textContent = quiz.title;
  quizQuestion.textContent = quiz.question;
  quizOptions.innerHTML = "";
  quiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuiz(task, index, mode));
    quizOptions.appendChild(button);
  });
  return true;
}
```

Update `openQuiz` to call:

```js
if (!renderQuizQuestion(task, task.quiz, "core")) {
  messageEl.textContent = "题目暂时不可用，请稍后再试。";
  state.activeQuiz = null;
  return;
}
```

Keep its existing gating, dialogue close, panel display, and HUD calls.

- [ ] **Step 5: Add bonus-choice functions**

Add:

```js
function finishAcornTownBonusChoice(message) {
  state.acornBonusStatus = "resolved";
  closeQuiz();
  messageEl.textContent = message;
  updateHud();
}

function skipAcornTownBonus() {
  finishAcornTownBonusChoice("奖励谜题已跳过，关卡可以完成。");
}

function openAcornTownBonusQuiz(task = state.activeQuiz) {
  if (!task?.bonusQuiz) {
    skipAcornTownBonus();
    return false;
  }
  state.acornBonusStatus = "answering";
  return renderQuizQuestion(task, task.bonusQuiz, "bonus");
}

function showAcornTownBonusChoice(task) {
  if (!task?.bonusQuiz) {
    state.acornBonusStatus = "resolved";
    closeQuiz();
    return;
  }
  state.acornBonusStatus = "offered";
  state.activeQuiz = task;
  quizTitle.textContent = "额外挑战";
  quizQuestion.textContent = "要挑战一道不扣时间的奖励谜题吗？";
  quizOptions.innerHTML = "";

  const challenge = document.createElement("button");
  challenge.type = "button";
  challenge.textContent = "挑战奖励谜题";
  challenge.addEventListener("click", () => openAcornTownBonusQuiz(task));

  const finish = document.createElement("button");
  finish.type = "button";
  finish.textContent = "直接完成关卡";
  finish.addEventListener("click", skipAcornTownBonus);

  quizOptions.append(challenge, finish);
  quizPanel.hidden = false;
}
```

- [ ] **Step 6: Branch required and bonus answer behavior**

Change the signature to:

```js
function answerQuiz(task, index, mode = "core") {
```

At the start, select:

```js
const quiz = mode === "bonus" ? task.bonusQuiz : task.quiz;
if (!quiz) return;
```

Use `quiz.answer` instead of `task.quiz.answer`.

At the top of the correct-answer branch, add:

```js
if (mode === "bonus") {
  state.correctAnswers += 1;
  const points = CATS_OWLS_ACORN_TOWN_RULES.bonusPoints();
  addRunPoints(points, task.x, task.y, `+${points} 奖励积分`);
  finishAcornTownBonusChoice("奖励谜题答对啦，额外获得 10 分！");
  return;
}
```

Replace the rest of the normal correct-answer branch with this ordering so the existing early `closeQuiz()` does not dismiss the bonus choice:

```js
state.correctAnswers += 1;
addRunPoints(8, task.x, task.y, "+8 积分");
completeTask(task, task.x, task.y);
if (task.acornTownShared && levels[state.levelIndex]?.world === "acorn_town") {
  showAcornTownBonusChoice(task);
  return;
}
closeQuiz();
if (isMistSwampLevel() && task.kind === "mud_boss") {
  messageEl.textContent = "泥浆怪安静下来了，它原来是在守护沼泽。";
}
return;
```

At the start of the wrong-answer branch, before the existing Mist Swamp branch, add:

```js
if (mode === "bonus") {
  state.wrongAnswers += 1;
  finishAcornTownBonusChoice("奖励谜题没有答对，但不扣时间，关卡仍然完成。");
  return;
}
```

Keep the remaining required-question wrong-answer logic unchanged.

- [ ] **Step 7: Prevent settlement while the bonus choice is open**

In `canSettleCurrentLevel`, after confirming required tasks are done, add:

```js
if (
  levels[state.levelIndex]?.world === "acorn_town" &&
  ["offered", "answering"].includes(state.acornBonusStatus)
) {
  return false;
}
```

- [ ] **Step 8: Run the runtime and quiz tests**

Run:

```bash
node --test tests/acorn-town-runtime.test.mjs tests/acorn-town-quiz-run.test.mjs tests/acorn-town-quiz-bank.test.mjs
```

Expected: PASS.

- [ ] **Step 9: Commit the bonus flow**

```bash
git add game.js tests/acorn-town-runtime.test.mjs
git commit -m "feat: add optional Acorn Town bonus riddles"
```

---

### Task 6: Full Regression and Browser Verification

**Files:**
- Verify: `game.js`
- Verify: `acorn-town-rules.js`
- Verify: `acorn-town-quiz-bank.js`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes: the completed traffic, catalog, assignment, and bonus-flow changes.
- Produces: verification evidence only; no new feature code.

- [ ] **Step 1: Run syntax checks**

Run:

```bash
node --check game.js
node --check acorn-town-rules.js
node --check acorn-town-quiz-bank.js
```

Expected: all commands exit `0`.

- [ ] **Step 2: Run all Node tests**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 3: Check formatting and changed-file scope**

Run:

```bash
git diff --check
git status --short
git diff --stat HEAD~4..HEAD
```

Expected:

- No whitespace errors.
- Only the planned JavaScript, test, spec, and plan files are changed.
- No assets are changed.

- [ ] **Step 4: Start the local server**

Run:

```bash
node server.js
```

Open:

```text
http://127.0.0.1:5177/?level=26
```

- [ ] **Step 5: Verify Easy in the browser**

Set Easy difficulty and play all four Acorn Town levels.

Confirm:

- Each level has one vehicle moving at the slowest visible speed.
- Vehicle collision knocks the player back but does not reduce time or hearts.
- The required question and optional bonus riddle are different.
- Skipping the bonus permits completion.

- [ ] **Step 6: Verify Crazy in the browser**

Set Crazy difficulty and play all four Acorn Town levels.

Confirm:

- Each level has four vehicles moving at the fastest visible speed.
- One collision subtracts 6 seconds, knocks the player back, and does not remove hearts or inventory.
- Eight displayed questions across the chapter are all different.
- Restarting a level preserves that level's two assigned questions.
- A wrong bonus answer does not subtract time or block completion.

- [ ] **Step 7: Verify other worlds remain unchanged**

Open one Forest Road level and one Mist Swamp level.

Confirm:

- Their vehicle or obstacle behavior is unchanged.
- Their quiz flow does not display the Acorn Town bonus choice.
- No console errors appear.

- [ ] **Step 8: Record the final branch state**

Run:

```bash
git status --short
git log --oneline -n 8
```

Expected: clean worktree and a clear sequence of focused commits.
