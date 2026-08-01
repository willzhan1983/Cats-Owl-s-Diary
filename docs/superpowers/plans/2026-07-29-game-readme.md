# Game README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a bilingual root `README.md` that explains the complete playable game, its controls, chapters, systems, local setup, current limitations, and prioritized optimization opportunities.

**Architecture:** The README is a single source-backed Markdown document. Chinese is the primary language, with English summaries for the overview, controls, and setup; all gameplay and completion claims must be traceable to the current `codex/acorn-town` branch.

**Tech Stack:** Markdown, HTML5 Canvas, vanilla JavaScript, Node.js static server, Node test runner.

## Global Constraints

- Target branch: `codex/acorn-town`.
- Create only the root `README.md`; do not change gameplay code or art.
- Document implemented content as playable and planned map regions as not yet implemented.
- Use relative repository paths only.
- Do not include unfinished placeholder markers, speculative features, credentials, or machine-specific installation paths.
- Include the confirmed mobile header overlap in the optimization backlog.

---

### Task 1: Create the bilingual game README

**Files:**
- Create: `README.md`
- Reference: `game.js`
- Reference: `world-map.js`
- Reference: `index.html`
- Reference: `acorn-town-rules.js`
- Reference: `tests/*.test.mjs`

**Interfaces:**
- Consumes: playable level names, world identifiers, difficulty settings, controls, progress rules, and repository paths.
- Produces: one root `README.md` used as the game overview and optimization index.

- [ ] **Step 1: Record the verified playable chapters**

Run:

```bash
rg -n 'name: "|world: "' game.js
```

Expected: source entries for the base Forest School levels, Moonlight Lake, Apple Valley, Forest Road, Mist Swamp, and Acorn Town.

- [ ] **Step 2: Create `README.md` with the approved structure**

Use these exact top-level sections:

```markdown
# Cats & Owl's Diary 3.0
## 游戏简介 / Game Overview
## 适合谁玩 / Intended Players
## 故事与角色 / Story and Characters
## 快速开始 / Quick Start
## 操作方法 / Controls
## 核心玩法 / Core Gameplay
## 世界与关卡 / Worlds and Levels
## 难度系统 / Difficulty
## 成长、积分与解锁 / Progression, Score and Unlocks
## 项目结构 / Project Structure
## 测试 / Testing
## 当前版本状态 / Current Version Status
## 已知问题 / Known Issues
## 优化建议 / Optimization Backlog
```

The world table must distinguish:

- Playable: Forest School base adventure, Moonlight Lake, Apple Valley, Forest Road, Mist Swamp, Acorn Town.
- Planned or map-only: Riverside Dock, Wetland Park, Starlight Mountain, and any region without playable `game.js` levels.

- [ ] **Step 3: Verify referenced repository paths**

Run:

```bash
for path in index.html game.js world-map.js style.css server.js acorn-town-rules.js acorn-town-map-entry.js acorn-town-quiz-bank.js tests; do test -e "$path" || exit 1; done
```

Expected: exit code `0`.

- [ ] **Step 4: Check for placeholders and formatting errors**

Run:

```bash
rg -n 'TO''DO|TB''D|PLACE''HOLDER' README.md
git diff --check
```

Expected: `rg` returns no matches and `git diff --check` returns exit code `0`.

- [ ] **Step 5: Run the existing regression suite**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: all 27 tests pass with zero failures.

- [ ] **Step 6: Commit the README**

```bash
git add README.md
git commit -m "docs: add complete game README"
```
