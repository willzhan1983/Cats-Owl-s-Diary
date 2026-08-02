# Architecture Rules

## Do Not

- 不要重写现有游戏引擎。
- 不要迁移 Unity。
- 不要迁移 Unreal。
- 不要为小功能引入大型服务器。
- 不要在小 bug 修复中顺带重构无关模块。

## Prefer

- 数据配置化。
- 题库独立。
- 资源独立。
- 小 PR。
- 保留现有加载顺序、fallback 和兼容行为。

## Long-term Direction

- `levels` 数据化。
- `quiz` 数据化。
- `assets` 版本管理。

长期演进应分阶段进行，每一步都要有对应测试和可回滚的 PR，不能一次性改变运行时契约。
