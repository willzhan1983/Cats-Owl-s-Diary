# Cats & Owl's Diary 美术资产规格表

这份文档用于统一后续所有角色、NPC、Boss、道具、障碍物和 UI 图标的命名、尺寸和导出标准。

目标：让游戏从“原型画面”逐步升级为统一、可爱、立体、绘本风的正式版本。

---

## 1. 通用规则

所有正式游戏素材优先使用 PNG 透明背景。

通用标准：

- 文件格式：PNG，透明背景
- 命名方式：英文小写 + 短横线
- 视角：正面偏 3/4 视角
- 光源：左上方
- 风格：童话绘本风、柔和描边、柔和投影
- 颜色：明亮但不刺眼，主角最突出，NPC 稍弱一点
- 导出：不要白底，不要裁掉耳朵、尾巴、翅膀或道具

命名示例：

```text
mimi-idle.png
mimi-walk.png
owlly-fly.png
lily.png
black-bear-idle.png
pond.png
```

不要使用：

```text
新图1.png
小猫最终版.png
角色aaaa.png
imagegen.png
主角修改最终最终.png
```

---

## 2. 主角资产

### Mimi 小猫

Mimi 是品牌主角之一，形象必须保持一致。

视觉标准：

- 白猫
- 蓝蝴蝶结
- 蓝裙子
- 大眼睛
- 圆脸
- 柔和毛边
- 脚下小阴影
- 不要变成橘猫
- 不要改服装颜色

| 用途 | 文件路径 | 建议尺寸 | 说明 |
|---|---|---:|---|
| 站立 | `assets/characters/mimi/idle.png` | 128×128 | 默认站立状态 |
| 走路 | `assets/characters/mimi/walk.png` | 128×128 | 移动时显示 |
| 开心 | `assets/characters/mimi/happy.png` | 128×128 | 完成任务或胜利时 |
| 跳跃 | `assets/characters/mimi/jump.png` | 128×128 | 后续平台玩法用 |
| 挥手 | `assets/characters/mimi/wave.png` | 128×128 | 对话、打招呼 |
| 头像 | `assets/characters/mimi/portrait.png` | 256×256 | 对话框、日记页 |
| 半身像 | `assets/characters/mimi/dialog.png` | 512×512 | 剧情对话用 |

---

### Owlly 猫头鹰

Owlly 是 Mimi 的伙伴，负责记录日记、整理故事。

视觉标准：

- 粉色猫头鹰
- 圆眼镜
- 紫色小帽子或花朵装饰
- 温柔聪明
- 手持日记本或羽毛笔
- 羽毛有层次
- 不使用旧绿色版，除非后续做皮肤

| 用途 | 文件路径 | 建议尺寸 | 说明 |
|---|---|---:|---|
| 站立 | `assets/characters/owlly/idle.png` | 128×128 | 默认状态 |
| 飞行 | `assets/characters/owlly/fly.png` | 128×128 | 跟随 Mimi 时 |
| 写日记 | `assets/characters/owlly/write.png` | 128×128 | 日记界面 |
| 开心 | `assets/characters/owlly/happy.png` | 128×128 | 完成任务时 |
| 眨眼 | `assets/characters/owlly/wink.png` | 128×128 | 对话表情 |
| 头像 | `assets/characters/owlly/portrait.png` | 256×256 | 对话框 |
| 半身像 | `assets/characters/owlly/dialog.png` | 512×512 | 剧情对话 |

---

## 3. NPC 资产

第一批 NPC：

| 角色 | 场景文件 | 头像文件 | 场景尺寸 | 头像尺寸 | 说明 |
|---|---|---|---:|---:|---|
| Lily 小兔子 | `assets/npc/lily.png` | `assets/npc/lily-portrait.png` | 96×96 | 200×200 | 温柔、篮子、粉裙 |
| Coco 小松鼠 | `assets/npc/coco.png` | `assets/npc/coco-portrait.png` | 96×96 | 200×200 | 活泼、橡果、围巾 |
| Nono 小刺猬 | `assets/npc/nono.png` | `assets/npc/nono-portrait.png` | 96×96 | 200×200 | 书本、眼镜、聪明 |
| Dodo 小鸭 | `assets/npc/dodo.png` | `assets/npc/dodo-portrait.png` | 96×96 | 200×200 | 蓝帽子、网兜、水边 |
| Ruru 小浣熊 | `assets/npc/ruru.png` | `assets/npc/ruru-portrait.png` | 96×96 | 200×200 | 背包、探险感 |

NPC 视觉标准：

- 比主角略小
- 头大身体小
- 每个角色有一个标志物
- 脚下有阴影
- 边缘不能太硬
- 颜色不要抢主角
- 角色之间要能一眼区分

---

## 4. Boss / 黑熊怪资产

黑熊怪是重要 Boss / 森林守卫角色，不能遗漏。

视觉标准：

- 黑棕色毛发
- 黄色眼睛
- 叶子披肩
- 肚子有旋涡纹
- 大体型，有压迫感
- 但不能恐怖，仍然要适合儿童治愈风
- 后续可从 Boss 变成朋友

| 用途 | 文件路径 | 建议尺寸 | 说明 |
|---|---|---:|---|
| 默认 | `assets/boss/black-bear/idle.png` | 192×192 | Boss 默认站立 |
| 生气 | `assets/boss/black-bear/angry.png` | 192×192 | 进入战斗 |
| 攻击 | `assets/boss/black-bear/attack.png` | 192×192 | 发射橡果或叶子 |
| 防御 | `assets/boss/black-bear/shield.png` | 192×192 | 叶子护盾 |
| 受伤 | `assets/boss/black-bear/hurt.png` | 192×192 | 被击中 |
| 睡着 | `assets/boss/black-bear/sleep.png` | 192×192 | 被安抚后 |
| 头像 | `assets/boss/black-bear/portrait.png` | 256×256 | Boss 对话框 |

---

## 5. 道具资产

道具统一建议 96×96。

| 道具 | 文件路径 | 建议尺寸 | 说明 |
|---|---|---:|---|
| 苹果 | `assets/props/apple.png` | 96×96 | 基础收集物 |
| 金苹果 | `assets/props/golden-apple.png` | 96×96 | 高价值道具 |
| 勇气星 | `assets/props/courage-star.png` | 96×96 | 战斗 / 任务奖励 |
| 守护书 | `assets/props/guard-book.png` | 96×96 | 日记核心道具 |
| 魔法铅笔 | `assets/props/magic-pencil.png` | 96×96 | 解锁 / 攻击道具 |
| 药水 | `assets/props/potion.png` | 96×96 | 恢复道具 |
| 羽毛 | `assets/props/feather.png` | 96×96 | Owlly 相关道具 |
| 地图 | `assets/props/map.png` | 96×96 | 世界地图道具 |

道具视觉标准：

- 外轮廓清楚
- 颜色明亮
- 自带高光
- 尺寸统一
- 不要太写实
- 每个道具下可带小阴影

---

## 6. 障碍物资产

| 障碍物 | 文件路径 | 建议尺寸 | 说明 |
|---|---|---:|---|
| 水坑 / 池塘 | `assets/obstacles/pond.png` | 192×128 | 必须优先重做 |
| 灌木 | `assets/obstacles/bush.png` | 160×120 | 柔和、带花 |
| 土坑 | `assets/obstacles/pit.png` | 160×120 | 泥土边缘 |
| 树桩 | `assets/obstacles/stump.png` | 128×128 | 木纹明显 |
| 石头 | `assets/obstacles/rock.png` | 128×128 | 圆润，不尖锐 |
| 蘑菇 | `assets/obstacles/mushroom.png` | 128×128 | 可爱场景装饰 |
| 木牌 | `assets/obstacles/sign.png` | 128×128 | 关卡提示 |

水坑特别标准：

- 不要是规则圆圈
- 边缘要不规则
- 有浅蓝到深蓝渐变
- 有白色水面高光
- 有荷叶 / 小草 / 花朵
- 周围有柔和草边
- 整体像小池塘，不像蓝色椭圆

---

## 7. UI 图标资产

| UI | 文件路径 | 建议尺寸 | 用途 |
|---|---|---:|---|
| 爱心 | `assets/ui/heart.png` | 64×64 | 爱心值 |
| 日记 | `assets/ui/diary-icon.png` | 64×64 | 日记按钮 |
| 背包 | `assets/ui/bag-icon.png` | 64×64 | 背包 |
| 任务板 | `assets/ui/task-board.png` | 256×128 | 任务面板背景 |
| 对话框 | `assets/ui/dialog-frame.png` | 512×180 | 对话框背景 |
| 世界地图 | `assets/ui/world-map-icon.png` | 64×64 | 世界地图按钮 |
| 星星 | `assets/ui/star.png` | 64×64 | 评分 / 奖励 |

---

## 8. 第一批最小可执行包

第一阶段优先准备这些文件：

```text
assets/characters/mimi/idle.png
assets/characters/mimi/walk.png
assets/characters/mimi/happy.png
assets/characters/owlly/idle.png
assets/characters/owlly/fly.png

assets/npc/lily.png
assets/npc/coco.png
assets/npc/nono.png
assets/npc/dodo.png
assets/npc/ruru.png

assets/boss/black-bear/idle.png

assets/props/apple.png
assets/props/courage-star.png
assets/props/guard-book.png
assets/props/potion.png

assets/obstacles/pond.png
```

这一批最容易让玩家马上感觉到：主角变了、NPC 变了、黑熊怪出现了、水坑不再像圆圈、苹果和星星更可爱。

---

## 9. 导出检查表

每张图导出前检查：

- 是否透明背景
- 是否居中
- 脚底是否留出 8–12 px 空白
- 是否有柔和投影
- 是否没有白边
- 是否没有被裁掉耳朵、尾巴、翅膀或道具
- 是否和其他角色比例统一
- 是否保持 3/4 视角
- 是否能在 96×96 小尺寸下看清楚

---

## 10. 接入节奏

推荐路线：

1. PNG 静态图先接入
2. 主角 Mimi / Owlly 进入关卡
3. NPC + 黑熊怪进入关卡
4. 道具 + 水坑替换
5. 再做多动作 PNG
6. 最后考虑 sprite sheet 或 Phaser 升级

不要再用运行时 patch 方式强行替换核心函数。后续应小步直接修改 `game.js` 中真实绘制函数，每次只改一个模块。
