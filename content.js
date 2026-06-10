// UNIVERSAL CHECKSUM: Validates if the page is public GitHub or an enterprise instance
const isGitHubPage =
  document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') === 'GitHub' ||
  window.location.hostname.includes('github') ||
  document.querySelector('a[href="https://github.com"]');

if (isGitHubPage) {
  console.log("🎉 Mergefetti initialized on this GitHub instance.");

  document.addEventListener('click', (event) => {
    const targetButton = event.target.closest('button');
    if (!targetButton) return;

    const btnText = targetButton.textContent.trim().toLowerCase();
    const btnClass = targetButton.className.toLowerCase();

    // 1. STRICT MATCHING FOR THE ULTIMATE CONFIRMATION STEP ONLY
    // Looks for the word "confirm" alongside "merge" to catch standard and bypass variants:
    // Matches: "confirm merge", "confirm squash and merge", "confirm rebase and merge", "confirm bypass rules and merge"
    const isTrueConfirmMerge = btnText.includes('confirm') && btnText.includes('merge');

    // Explicit fallback for class matches if GitHub styles are altered
    const isClassMatch = btnClass.includes('confirm-merge');

    // 2. EXCLUSION GUARD
    // If it's the preliminary button text without "confirm", skip it so it won't fire early
    if (btnText === 'bypass rules and merge') {
      return;
    }

    if (isTrueConfirmMerge || isClassMatch) {
      console.log(`🎯 Ultimate confirmation step detected: "${targetButton.textContent.trim()}"`);

      // Tiny delay so the UI processes the click framework execution first
      setTimeout(() => {
        if (typeof window.confettiRain === 'function') {
          window.confettiRain();
        }
      }, 150);
    }
  }, true);
}