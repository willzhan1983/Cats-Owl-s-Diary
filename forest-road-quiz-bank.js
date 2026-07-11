/* Difficulty-aware Forest Road quiz pool and one quiz task per level. */
(function setupForestRoadQuizBank() {
  if (typeof quizBank === "undefined" || typeof levels === "undefined") return;

  const FOREST_ROAD_WORLD_ID = "forest_road";
  const FOREST_ROAD_QUIZ_KEY = "forestRoadShared";

  const forestRoadQuestions = [
    { difficulty: "easy", title: "森林公路小问题", question: "路上有树枝挡住时，应该怎么做？", options: ["清理后再走", "闭着眼睛冲过去", "把树枝踢向朋友", "不看路一直跑"], answer: 0 },
    { difficulty: "easy", title: "森林公路小问题", question: "落叶堆旁边有小石块，先要注意什么？", options: ["看清脚下", "跑得更快", "把石块扔远", "不管它"], answer: 0 },
    { difficulty: "easy", title: "森林公路小问题", question: "看到破损路牌时，哪样东西能帮助修好它？", options: ["路牌碎片", "苹果篮", "月亮灯", "铅笔盒"], answer: 0 },
    { difficulty: "easy", title: "森林公路小问题", question: "绿灯亮起时，应该怎么做？", options: ["观察后安全通过", "马上闭眼跑", "在路中间停住", "推小伙伴"], answer: 0 },
    { difficulty: "easy", title: "森林公路小问题", question: "迷路的小伙伴跟上来后，要带它去哪里？", options: ["安全区", "石头堆里", "水坑里", "回到危险路口"], answer: 0 },
    { difficulty: "easy", title: "森林公路小问题", question: "走错出口时，游戏会怎样？", options: ["提示再找正确的路", "扣掉所有爱心", "立刻重开", "不能再走"], answer: 0 },

    { difficulty: "normal", title: "森林公路观察题", question: "清完树枝、落叶和石块后，道路会怎样？", options: ["更安全好走", "变成湖水", "没有任何变化", "只能倒着走"], answer: 0 },
    { difficulty: "normal", title: "森林公路观察题", question: "路牌指向橡果镇，应该选择哪一条路？", options: ["写着橡果镇的方向", "写着苹果谷的方向", "没有路牌的草地", "有石头挡住的方向"], answer: 0 },
    { difficulty: "normal", title: "森林公路观察题", question: "红灯时进入斑马线，最合适的做法是？", options: ["等绿灯再走", "继续快速通过", "坐在路中间", "让伙伴先冲"], answer: 0 },
    { difficulty: "normal", title: "森林公路观察题", question: "小伙伴离 Mimi 太远时，会怎样？", options: ["自动靠近 Mimi", "永远消失", "让关卡失败", "变成石头"], answer: 0 },
    { difficulty: "normal", title: "森林公路观察题", question: "有 2 堆树枝和 1 堆落叶需要清理，一共有几处障碍？", options: ["2", "3", "4", "5"], answer: 1 },
    { difficulty: "normal", title: "森林公路观察题", question: "修好路牌后，下一步最合适的是？", options: ["按提示选路线", "把路牌藏起来", "回到起点不动", "走进错误出口"], answer: 0 },

    { difficulty: "hard", title: "森林公路挑战题", question: "先收集路牌碎片，再修好路牌，最后选出口，正确顺序是哪一个？", options: ["碎片、修牌、选出口", "选出口、碎片、修牌", "修牌、选出口、碎片", "碎片、选出口、修牌"], answer: 0 },
    { difficulty: "hard", title: "森林公路挑战题", question: "红绿灯每 2 秒切换一次。现在是红灯，安全通过前最少应等到什么状态？", options: ["绿灯", "更亮的红灯", "没有灯", "下雨"], answer: 0 },
    { difficulty: "hard", title: "森林公路挑战题", question: "护送时先到安全区，但小伙伴还没跟上，应该怎么办？", options: ["靠近并等它自动跟来", "离开安全区继续跑", "让它穿过障碍", "结束游戏"], answer: 0 },
    { difficulty: "hard", title: "森林公路挑战题", question: "道路上有 2 堆树枝、3 堆落叶和 2 组石块，一共有多少处要清理？", options: ["5", "6", "7", "8"], answer: 2 },
    { difficulty: "hard", title: "森林公路挑战题", question: "错误出口只会提示，不会惩罚。这样做的主要原因是什么？", options: ["让玩家安全地重新判断路线", "让玩家永远走错", "取消任务", "增加伤害"], answer: 0 },
    { difficulty: "hard", title: "森林公路挑战题", question: "要护送伙伴安全过路，最重要的两件事是什么？", options: ["跟上伙伴并观察红绿灯", "跑得最快并跳过斑马线", "不看路牌并绕远", "一直停在起点"], answer: 0 },

    { difficulty: "crazy", title: "森林公路综合挑战", question: "Mimi 先清理 3 处障碍，又清理 4 处，还剩 5 处。原来有多少处障碍？", options: ["7", "8", "11", "12"], answer: 3 },
    { difficulty: "crazy", title: "森林公路综合挑战", question: "已修好路牌，红灯亮着，小伙伴在身后。最安全的下一步是什么？", options: ["带着伙伴等绿灯", "独自立刻冲过路口", "走进错误出口", "回去拆掉路牌"], answer: 0 },
    { difficulty: "crazy", title: "森林公路综合挑战", question: "有 7 个障碍，已经清理了 3 个。再清理几个才能全部完成？", options: ["2", "3", "4", "5"], answer: 2 },
    { difficulty: "crazy", title: "森林公路综合挑战", question: "路线提示是“右边去橡果镇、左边去苹果谷、下方去森林学校”。要去橡果镇应怎么选？", options: ["向右", "向左", "向下", "不看提示随便走"], answer: 0 },
    { difficulty: "crazy", title: "森林公路综合挑战", question: "红灯时等待、绿灯时通过、到安全区后完成护送。哪个顺序正确？", options: ["等红灯结束、绿灯通过、到安全区", "绿灯等待、红灯冲过、回起点", "到安全区后才看红灯", "一直走错误出口"], answer: 0 },
    { difficulty: "crazy", title: "森林公路综合挑战", question: "森林公路任务的共同目标是什么？", options: ["让大家安全到达橡果镇", "把所有路牌搬走", "让伙伴迷路", "只收集苹果"], answer: 0 },
  ];

  function appendUniqueQuestions(key, questions) {
    if (!Array.isArray(quizBank[key])) quizBank[key] = [];
    const existing = new Set(quizBank[key].map((question) => question.question));
    questions.forEach((question) => {
      if (!existing.has(question.question)) {
        quizBank[key].push(question);
        existing.add(question.question);
      }
    });
  }

  const placements = [
    { level: "森林公路入口", x: 792, y: 188, name: "清路安全题", animal: "riddle", speech: "清完道路前，先回答一道安全小问题。" },
    { level: "弯弯森林小路", x: 660, y: 380, name: "路线观察题", animal: "directionSign", speech: "修好路牌后，用路线知识回答一题。" },
    { level: "护送小动物过路", x: 350, y: 188, name: "过路安全题", animal: "riddle", speech: "带小伙伴过路前，先想想安全规则。" },
    { level: "橡果镇路口", x: 716, y: 408, name: "橡果镇综合题", animal: "directionSign", speech: "到终点前，完成一道森林公路综合题。" },
  ];

  function forestRoadQuizTask(placement) {
    return {
      x: placement.x,
      y: placement.y,
      name: placement.name,
      animal: placement.animal,
      speech: placement.speech,
      quizKey: FOREST_ROAD_QUIZ_KEY,
      quiz: null,
      kind: "quiz",
      done: false,
      progress: 0,
      forestRoadShared: true,
    };
  }

  function refreshCurrentForestRoadLevel() {
    if (typeof state === "undefined" || !state) return;
    const level = levels[state.levelIndex];
    if (level?.world !== FOREST_ROAD_WORLD_ID || typeof resetGame !== "function") return;
    const wasRunning = state.running;
    resetGame(state.levelIndex, state.levelIndex > 0);
    if (wasRunning) {
      state.running = true;
      state.introSeen = true;
      startBtn.textContent = text.restart;
    }
  }

  appendUniqueQuestions(FOREST_ROAD_QUIZ_KEY, forestRoadQuestions);
  placements.forEach((placement) => {
    const level = levels.find((entry) => entry.world === FOREST_ROAD_WORLD_ID && entry.name === placement.level);
    if (!level || !Array.isArray(level.tasks)) return;
    if (!level.tasks.some((task) => task.forestRoadShared || task.quizKey === FOREST_ROAD_QUIZ_KEY)) {
      level.tasks.push(forestRoadQuizTask(placement));
    }
  });

  window.CATS_OWLS_FOREST_ROAD_QUIZ = {
    key: FOREST_ROAD_QUIZ_KEY,
    count: quizBank[FOREST_ROAD_QUIZ_KEY].length,
  };

  refreshCurrentForestRoadLevel();
})();
