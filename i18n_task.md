# Task: i18n for LeaderboardSystem Component

## Background
`src/components/LeaderboardSystem.jsx` has hardcoded English strings. The project uses a custom i18n system (`src/i18n/index.jsx`) with `useI18n()` hook returning `{ t }`. There are **44 locale files** in `src/i18n/locales/`.

## Step 1: Add keys to `en-US.json`

Add the following keys to `src/i18n/locales/en-US.json`:

```json
"leaderboard.title": "🏆 Global Top 10",
"leaderboard.yourScore": "Your Score: {score}",
"leaderboard.qualified": "🎉 You made the Top 10! Enter your name:",
"leaderboard.namePlaceholder": "Your name",
"leaderboard.save": "Save",
"leaderboard.saving": "...",
"leaderboard.skip": "Skip",
"leaderboard.charCount": "{count}/10",
"leaderboard.loading": "Loading...",
"leaderboard.error": "Could not load leaderboard",
"leaderboard.submitError": "Failed to submit score",
"leaderboard.rateLimited": "Too many attempts. Please try again later.",
"leaderboard.sessionError": "Game session expired. Please restart the game.",
"leaderboard.empty": "No scores yet. Be the first!",
"leaderboard.playAgain": "🔄 Play Again"
```

## Step 2: Modify `LeaderboardSystem.jsx`

1. Add import: `import { useI18n } from '../i18n'`
2. Inside the component function, add: `const { t } = useI18n()`
3. Replace these hardcoded strings:

| Hardcoded string | Replace with |
|---|---|
| `🏆 Global Top 10` | `{t('leaderboard.title')}` |
| `` Your Score: ${score} `` (the whole div content) | `{t('leaderboard.yourScore', { score })}` |
| `🎉 You made the Top 10! Enter your name:` | `{t('leaderboard.qualified')}` |
| `"Your name"` (placeholder) | `{t('leaderboard.namePlaceholder')}` |
| `'Save'` | `{t('leaderboard.save')}` |
| `'...'` (submitting state) | `{t('leaderboard.saving')}` |
| `Skip` (button text) | `{t('leaderboard.skip')}` |
| `` {playerName.length}/10 `` | `{t('leaderboard.charCount', { count: playerName.length })}` |
| `'Could not load leaderboard'` (in fetchLeaderboard catch) | `t('leaderboard.error')` |
| `'Failed to submit score'` (in handleSubmitScore catch) | `t('leaderboard.submitError')` |
| Rate limit error message (429 response) | `t('leaderboard.rateLimited')` |
| Token/session error message (403 response) | `t('leaderboard.sessionError')` |
| `No scores yet. Be the first!` | `{t('leaderboard.empty')}` |
| `🔄 Play Again` | `{t('leaderboard.playAgain')}` |

**Note for "Your Score"**: The current JSX is:
```jsx
<div className="...">Your Score: {score}</div>
```
Change to:
```jsx
<div className="...">{t('leaderboard.yourScore', { score })}</div>
```

## Step 3: Add translations to ALL 43 non-English locale files

For each of the 43 locale JSON files in `src/i18n/locales/`, add the same 15 keys with appropriate translations. 

**The locale files are**: `ar, as-IN, bn-BD, de-DE, es-ES, fa-IR, fil-PH, fr-FR, gu-IN, ha-NG, hi-IN, id-ID, it-IT, ja-JP, kk-KZ, km-KH, kn-IN, ko-KR, lo-LA, ml-IN, mr-IN, ms-MY, my-MM, ne-NP, nl-NL, or-IN, pa-IN, pl-PL, pt-BR, pt-PT, ru-RU, si-LK, sw-KE, ta-IN, te-IN, th-TH, tr-TR, uk-UA, ur-PK, uz-UZ, vi-VN, zh-CN, zh-TW`

**Rules**:
- Match the existing translation style/formality of each locale file
- Keep emoji (🏆 🎉 🔄) unchanged — they are universal
- Keep `{score}` and `{count}` interpolation placeholders exactly as-is
- Do NOT translate "Top 10" if it's commonly used as-is in that language (e.g., Japanese, Korean often keep "Top 10" in English)

## Verification
After all changes, run `cd static-site && pnpm run build` to verify no errors.
