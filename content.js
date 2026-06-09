document.addEventListener('click', (event) => {
  const targetButton = event.target.closest('button');
  if (!targetButton) return;

  const btnText = targetButton.textContent.trim().toLowerCase();
  const btnClass = targetButton.className.toLowerCase();

  // ADAPTIVE MATCHING: Looks for 'confirm' and 'merge' anywhere in the button text
  // Covers: "Confirm merge", "Confirm squash and merge", and "Confirm rebase and merge"
  const isConfirmMerge = btnText.includes('confirm') && btnText.includes('merge');
  const isAdminBypass = btnText.includes('bypass rules and merge');
  const isClassMatch = btnClass.includes('confirm-merge');

  if (isConfirmMerge || isAdminBypass || isClassMatch) {
    console.log(`🎯 Ultimate confirmation step detected: "${targetButton.textContent.trim()}"`);

    // Tiny delay so the UI processes the click framework execution first
    setTimeout(() => {
      if (typeof window.confettiRain === 'function') {
        window.confettiRain();
      }
    }, 150);
  }
}, true);