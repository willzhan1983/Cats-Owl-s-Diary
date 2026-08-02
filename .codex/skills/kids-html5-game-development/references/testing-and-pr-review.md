# Testing and PR Review

## PR Review Output

审核必须输出：

- 改了什么
- 为什么改
- 影响范围
- 测试结果
- 是否建议合并

结论使用以下之一：

- 可以合并
- 修复后合并
- 暂不合并

## Baseline Tests

- 修改 JavaScript 后执行 `node --check <file>`。
- 执行 `git diff --check`。
- 适用时执行 `node --test tests/*.test.mjs`。

涉及界面或移动端时，应在浏览器检查至少一个桌面视口和一个手机视口，确认无 console error、文字重叠、触控失效和越界。涉及题库时，应检查分类、难度、随机题目、选项随机化、正确答案和重复率。

报告只能陈述实际执行过的检查；未执行的项目必须标为未验证。
