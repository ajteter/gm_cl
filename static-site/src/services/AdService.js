/**
 * AdService - Handles Adsterra ad injection for the "Watch Ad to Revive" feature.
 *
 * The Social Bar ad is injected into the page when a revive is requested.
 * A time-based countdown (6s) is used to determine when to grant the reward,
 * since Adsterra's Social Bar has no close callback.
 *
 * CRITICAL: All Adsterra scripts must have data-cfasync="false" to prevent
 * Cloudflare Rocket Loader from intercepting and breaking ad execution.
 */

export const AdService = {
  /**
   * Injects the Adsterra Social Bar and resolves after a countdown.
   * @param {function(number): void} [onProgress] - Optional callback with remaining seconds (e.g. 5, 4, 3...)
   * @returns {Promise<boolean>} Resolves to true when the reward is granted.
   */
  showRewardedAd: async (onProgress) => {
    return new Promise((resolve) => {
      console.log('[AdService] Injecting Adsterra Social Bar...');

      // Inject Adsterra Social Bar script (only once per page load)
      const SCRIPT_SRC = 'https://pl29033214.profitablecpmratenetwork.com/6b/5f/09/6b5f09e0f69ed84a35e1fdba4253cc0b.js';
      if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = SCRIPT_SRC;
        // CRITICAL: Bypass Cloudflare Rocket Loader
        script.setAttribute('data-cfasync', 'false');
        // Adsterra recommends placing right above closing </body> tag
        document.body.appendChild(script);
      }

      // Countdown-based reward grant (6 seconds total)
      let timeLeft = 6;
      if (onProgress) onProgress(timeLeft);

      const interval = setInterval(() => {
        timeLeft -= 1;
        if (onProgress) onProgress(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(interval);
          console.log('[AdService] Reward time met, granting revive.');
          resolve(true);
        }
      }, 1000);
    });
  }
};
