---
name: kids-html5-game-development
description: Use when working on Cats & Owl's Diary HTML5 educational game features, bugs, PR reviews, quiz systems, assets, progression systems, or release workflows.
---

# Kids HTML5 Game Development

## Overview

这是 Cats & Owl's Diary 专用开发 Skill，将适合当前项目的 GameDevMind 游戏开发方法论落地为可执行规则。

目标是保持这款儿童教育小游戏长期可维护、可测试，并让功能、题库、素材和发布流程保持清晰边界。

## Core Principles

1. **小步修改，不大规模重构。** 只处理当前任务需要的文件和行为。
2. **优先兼容已有系统。** 保留现有关卡、状态、计分、时间和降级逻辑。
3. **数据配置优先。** 关卡、题库和资源元数据尽量通过数据配置扩展。
4. **测试优先。** 修改后先做语法、差异和相关行为检查，再报告结果。
5. **素材版本严格管理。** 区分正式资源、测试资源和已批准的角色素材。
6. **PR 必须控制范围。** 一个 PR 应有清晰目标，避免混入无关重构或素材变更。

## Development Mode

本 Skill 采用平衡模式。

### 低风险修改

以下修改可以直接处理：

- 小 bug
- 文案
- CSS 微调
- 单文件小修改
- 资源路径修复

完成后至少执行：

- 对修改过的 JavaScript 文件执行 `node --check`。
- 执行 `git diff --check`。
- 如果有对应测试，执行与修改范围匹配的测试。

### 高风险修改

以下修改必须先说明方案、影响范围、验证方式和回滚方式，再开始修改：

- `game.js` 核心流程
- 状态系统
- 题库结构
- 积分规则
- `localStorage` 数据
- 角色素材
- 关卡结构
- Firebase
- 登录
- 排行榜
- 大规模重构

高风险修改应优先拆成小 PR；没有明确必要性时，不引入新的引擎、服务或状态层。

## Mandatory Checks

每次修改完成时，报告必须包含：

- 修改内容说明
- 文件列表
- 风险说明
- 测试结果

基础检查包括：

- `node --check <changed-js>`
- `git diff --check`
- 适用时执行 `node --test tests/*.test.mjs`
- 涉及界面的修改应进行浏览器冒烟检查，并记录关键视口或场景

不能在没有证据时声称测试通过、备份成功、PR 已合并或发布完成。

## Project Boundaries

任务开始时先确认是否涉及 `game.js`、`index.html`、题库、角色素材或关卡数据。文档和 Skill 任务不得顺带修改这些运行内容。素材修改必须遵守 `references/asset-management.md`；题库修改必须遵守 `references/quiz-quality.md`。

## Workflow

1. 明确目标、范围和风险等级。
2. 读取相关项目规则和现有实现。
3. 只修改完成目标所需的文件。
4. 运行与变更匹配的自动化和浏览器检查。
5. 复核差异、PR 范围和遗留问题。
6. 只有在合并、主分支和备份均有证据时，才报告发布完成。

## References

- [项目背景](references/project-context.md)
- [架构规则](references/architecture-rules.md)
- [题库质量](references/quiz-quality.md)
- [素材管理](references/asset-management.md)
- [测试与 PR 审核](references/testing-and-pr-review.md)
- [备份与发布](references/backup-and-release.md)
- [任务报告模板](templates/task-report.md)
- [PR 审核模板](templates/pr-review.md)
