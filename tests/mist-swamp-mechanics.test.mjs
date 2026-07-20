import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");

assert.match(game, /MIST_CLEAR_TIME_BY_DIFFICULTY\s*=\s*\{[\s\S]*?easy:\s*null[\s\S]*?normal:\s*12000[\s\S]*?hard:\s*8000[\s\S]*?crazy:\s*6000/);
assert.match(game, /MUD_BUBBLE_COUNT_BY_DIFFICULTY\s*=\s*\{\s*easy:\s*2,\s*normal:\s*3,\s*hard:\s*4,\s*crazy:\s*4/);
assert.match(game, /function isMistSwampLevel\(\)[\s\S]*?world\s*===\s*"mist_swamp"/);
assert.match(game, /function updateMistSwampMechanisms\(dt\)\s*\{\s*if \(!isMistSwampLevel\(\)\) return;/);

for (const kind of ["mist_lamp", "firefly_trail", "mushroom_lamp", "broken_bridge", "mist_bubble", "mud_bubble", "mist_core", "mud_boss"]) {
  assert.ok(game.includes(`kind: "${kind}"`), `${kind} should exist`);
}
assert.ok(!game.includes('kind: "big_mist_lamp"'));

for (const copy of [
  "雾灯亮起来啦！",
  "这不是正确路线，再观察一下吧。",
  "再看一看萤火虫提示哦。",
  "蘑菇灯都亮啦！",
  "木桥修好啦，可以安全通过了！",
  "迷雾精灵恢复清醒啦！沼泽重新亮起来了。",
  "黑雾变淡了，泥浆怪露出了泥浆泡泡！",
  "泥浆怪安静下来了，它原来是在守护沼泽。",
]) assert.ok(game.includes(copy), `${copy} should exist`);

assert.ok(game.includes("temporaryMistItems"));
assert.ok(game.includes("mistGuardianBadge"));
assert.ok(game.includes("fireflyLantern"));
assert.ok(game.includes("雾灯还亮着，不需要重复放入灯芯。"));
assert.match(game, /task\.done && isMistLampActive\(task\)/);
assert.match(game, /task\.litUntil = clearTime === null \? null : performance\.now\(\) \+ clearTime/);
assert.match(game, /if \(!task\.done\) \{[\s\S]*?consumeNeeds\(\[need\]\)[\s\S]*?completeTask\(task, task\.x, task\.y\)/);
assert.match(game, /function drawMudBubbles\(\)[\s\S]*?mudBoss\?\.phase < 2/);
