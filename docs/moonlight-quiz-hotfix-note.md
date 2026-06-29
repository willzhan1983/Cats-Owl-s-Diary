# Moonlight Quiz Hotfix Note

This hotfix makes Moonlight Lake questions easier to verify in-game:

- Moonlight shared questions remain under `moonlightShared` for the Moonlight Lake injected quiz tasks.
- Moonlight questions are also shared into existing subject pools: math, logic, science, language, and english.
- `index.html` loads `moonlight-quiz-bank.js` with a cache-busting query string.

Manual check:

1. Hard refresh the page.
2. Select Grade 4, 5, or 6.
3. Enter the Day 4 classroom quiz or Moonlight Lake quiz points.
4. Confirm questions with Moonlight Lake wording appear.
