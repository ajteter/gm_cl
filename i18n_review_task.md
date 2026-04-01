# Task: Review & Fix Leaderboard i18n Translation Quality

## Background

The 15 `leaderboard.*` keys in `src/i18n/locales/en-US.json` have been machine-translated into 43 locale files. The translations may have quality issues. Your job is to review and fix them **in place**.

## Locale files location

`static-site/src/i18n/locales/*.json`

## The 15 keys to review

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

## Review checklist (apply to EVERY locale file)

### 1. Do NOT translate these items
- Emoji (🏆 🎉 🔄) must remain as-is
- `{score}` and `{count}` interpolation placeholders must be exactly `{score}` and `{count}` — not translated, not altered, not surrounded by extra characters
- `"leaderboard.saving"` should stay as `"..."` in ALL languages
- `"leaderboard.charCount"` should stay as `"{count}/10"` in ALL languages (this is a character counter, universal format)
- `"Top 10"` — keep in English if the target language commonly uses it as-is (ja-JP, ko-KR, zh-CN, zh-TW, etc.)

### 2. Common machine-translation mistakes to look for

| Issue | Example | Fix |
|-------|---------|-----|
| Placeholder corrupted | `{分数}`, `{スコア}`, `{점수}` | Must be `{score}` |
| Placeholder missing | `Your Score:` without `{score}` | Add `{score}` back |
| Double-encoded | `\{score\}`, `{{score}}` | Fix to `{score}` |
| Over-translated technical text | `"..."`→`"三个点"` / `"加载中……"` | `"..."` should stay as `"..."` for `leaderboard.saving` |
| Emoji removed or changed | `Play Again` without 🔄 | Add emoji back |
| Unnatural phrasing | Overly formal, robotic, or word-by-word translation | Rewrite to sound natural in target language |
| Wrong script/language | Hindi text in Urdu file, Simplified Chinese in zh-TW | Fix to correct script |
| Untranslated (left in English) | English text in non-English locale | Translate properly |

### 3. Language-specific attention

| Locale | Watch for |
|--------|-----------|
| `ar`, `fa-IR`, `ur-PK` | RTL languages — ensure text reads naturally, no English word order |
| `zh-TW` | Must use Traditional Chinese, not Simplified |
| `zh-CN` | Must use Simplified Chinese |
| `ja-JP` | Natural Japanese, not Chinese characters used in wrong context |
| `ko-KR` | Natural Korean, proper spacing (띄어쓰기) |
| `hi-IN`, `bn-BD`, `ta-IN`, `te-IN`, `kn-IN`, `ml-IN`, `mr-IN`, `gu-IN`, `pa-IN`, `or-IN`, `as-IN` | Indic scripts — verify correct script used, not Latin transliteration |
| `my-MM`, `km-KH`, `lo-LA` | Myanmar/Khmer/Lao script — verify not Latin |
| `si-LK` | Sinhala script |

### 4. Tone & context

This is a **casual mobile game** (Flappy Bird clone). Translations should be:
- Fun, casual, encouraging — not formal or corporate
- Short — these appear in a small mobile modal, long text will overflow
- Action-oriented for buttons (Save, Skip, Play Again)

## Output format

For each locale file you fix, briefly note what you changed. If a file looks fine, skip it.

**Do NOT change any keys other than the 15 `leaderboard.*` keys.**

## Verification

After all fixes, run:
```bash
cd static-site && pnpm run build
```
Ensure no build errors.
