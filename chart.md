# Role & Task Description
You are a Senior Full-Stack Architect. We are implementing a "Top 10 Global Leaderboard" for our `floppybird` HTML5 game, hosted within a React 19 app (Tailwind v4) on Cloudflare Pages. 

We will use **Cloudflare Pages Functions** for the API and **Cloudflare D1** for the database. 
Crucially, the game runs inside a Mobile App WebView. Therefore, all user input (Name Input) MUST be handled by the React host, NOT inside the game canvas, to avoid keyboard UI bugs. We must also strictly protect our D1 free-tier limits.

# Core Requirements & UX Flow
1. **Game Over**: When the player dies and score > 0, bypass the original game scoreboard. Send a `postMessage` to React with the final score.
2. **Leaderboard Fetch**: React fetches the Top 10 leaderboard from the Cloudflare API (cached for 10s at the edge).
3. **Qualification Check**: If the player's score qualifies for the Top 10, prompt for their name (Max 10 chars) using a React Modal positioned near the top of the screen (to avoid mobile keyboard overlap).
4. **Leaderboard Display**: Show the Top 10 list with Emoji flags (auto-detected via Cloudflare edge). **Explicitly display the player's current score** prominently on this screen. Provide a "Play Again" button.

# Step-by-Step Implementation Plan

## Step 1: D1 Schema Setup (`schema.sql`)
Create a table for the leaderboard.
```sql
CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    country VARCHAR(2) DEFAULT 'XX',
    score INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_score ON leaderboard(score DESC);
```

## Step 2: Pages Function API (`static-site/functions/api/leaderboard.js`)
Create the API handling GET and POST.
- **GET**: Fetch the top 10 scores. MUST use `caches.default` with a `s-maxage=10` to protect D1 read limits.
- **POST**: Accept `{ playerName, score }`. Automatically extract the country from `request.cf.country` (fallback to 'XX'). Insert into D1.

## Step 3: Game Engine Modification (`public/games/floppybird/js/main.js`)
Intercept the death logic. 
Find where the game transitions to `states.ScoreScreen` (likely inside `playerDead()` or `showScore()`).
Modify it:
```javascript
// Instead of showing the native scoreboard:
if (score > 0) {
    window.parent.postMessage({ type: 'GAME_OVER_LEADERBOARD', score: score }, '*');
    return; // Halt native scoreboard rendering
} else {
    // Show native scoreboard for 0 score
    showScore(); 
}
```
Add a listener in `$(document).ready()` to handle the restart command from React:
```javascript
window.addEventListener('message', function(e) {
    if (e.data.type === 'RESTART_GAME') {
        // Execute logic to reset game completely
        resetBirdPosition(); // or equivalent reset logic
        // Reset score, pipes, and start screen
        score = 0;
        currentstate = states.Splash;
        // ... (AI to fill in the exact floppybird reset logic)
    }
});
```

## Step 4: React UI - `LeaderboardSystem.jsx`
Create a new component `src/components/LeaderboardSystem.jsx` to manage this flow.
1. **State**: `isOpen`, `currentScore`, `leaderboardData`, `needsNameInput`.
2. **Flag Utility**: Create a function to convert a 2-letter ISO code to an Emoji flag.
3. **Name Input Modal**: A clean Tailwind v4 modal (positioned `top-20` absolute) asking for the name. On submit -> POST to API -> re-fetch leaderboard -> close input modal.
4. **Leaderboard Modal**: 
   - Displays: "Global Top 10".
   - Prominently displays: `"Your Score: {currentScore}"`.
   - Renders the list: Rank, Flag Emoji, Player Name, Score.
   - Button: "Play Again". On click -> send `postMessage({ type: 'RESTART_GAME' }, '*')` to the iframe and close the modal.

## Step 5: Integrate into `GameClientUI.jsx`
- Add a `message` event listener in `GameClientUI.jsx` to catch `GAME_OVER_LEADERBOARD`.
- When caught, pass the `score` to `<LeaderboardSystem />` and set it to open.

# Output Requirements
- Provide the complete code for `functions/api/leaderboard.js`.
- Provide the modifications for `public/games/floppybird/js/main.js`.
- Provide the complete React code for `src/components/LeaderboardSystem.jsx`.
- Ensure all Tailwind classes use the v4 standard and maintain the dark/glassmorphism theme.