// SAFETY CHECK: Detects if the current webpage is a public or self-hosted GitHub Enterprise instance
const isGitHubPage =
  document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') === 'GitHub' ||
  window.location.hostname.includes('github') ||
  document.querySelector('a[href="https://github.com"]');

if (isGitHubPage) {
  console.log("🎉 Mergefetti active on this GitHub instance!");

  // 1. Initialize the MutationObserver to monitor dynamic DOM changes (for SPA navigation)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        attachMergeButtonListener();
      }
    });
  });

  // Start observing the body element for structural layout changes
  observer.observe(document.body, { childList: true, subtree: true });

  // 2. Core function to find the merge button and attach our confetti trigger
  function attachMergeButtonListener() {
    // Target common GitHub merge button classes/attributes (.btn-group-merge, .js-merge-box-button, etc.)
    const mergeButtons = document.querySelectorAll(
      '.js-merge-box-button, button[data-details-container=".js-merge-pr-wrapper"]'
    );

    mergeButtons.forEach((button) => {
      // Prevent attaching duplicate event listeners to the same button
      if (!button.classList.contains('mergefetti-ready')) {
        button.classList.add('mergefetti-ready');

        button.addEventListener('click', () => {
          // Trigger the 3D-twirling paper shapes and party spirals
          triggerConfettiStorm();
        });
      }
    });
  }

  // 3. Confetti Animation Function using canvas-confetti
  function triggerConfettiStorm() {
    const duration = 3 * 1000; // Run for 3 seconds
    const end = Date.now() + duration;

    (function frame() {
      // Left side stream launching upwards and inwards
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#238636', '#2ea44f', '#58a6ff', '#ff7b72', '#d29922'] // GitHub-inspired palette
      });

      // Right side stream launching upwards and inwards
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#238636', '#2ea44f', '#58a6ff', '#ff7b72', '#d29922']
      });

      // Keep looping until the 3 seconds are up
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // Run an initial sweep right when the page loads
  attachMergeButtonListener();
}