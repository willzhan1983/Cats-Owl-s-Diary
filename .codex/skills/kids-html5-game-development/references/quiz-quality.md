# Quiz Quality

## Required Fields

每道题必须包含：

- `id`
- `category`
- `difficulty`
- `question`
- `options`
- `answer`

## Categories

允许的分类：

- `math`
- `english`
- `language`
- `reading`
- `logic`

## Rules

禁止：

- 数学题抽到英语题。
- 语文题抽到英语题。
- 阅读题变成计算题。
- 同一地图连续重复同一道题。
- 仅替换数字或词序的近似题连续出现。

必须：

- 按 `selectedDifficulty` 过滤题目。
- 保留明确的难度 fallback，不能因某档题库不足出现空题库或黑屏。
- 随机化题目和选项，同时保留正确答案对应关系。
- 校验 `answer` 在 `options` 中存在且唯一。
- 在题库 QA 中覆盖重复、近似重复、分类和难度边界。

推荐的难度 fallback 顺序为：目标难度、较低一档，直到 `easy`；挑战档可回退到 `hard`。
