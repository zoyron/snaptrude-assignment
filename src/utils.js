export function updateModeDisplay(mode) {
  const displayMode = document.getElementById("mode-display");
  displayMode.textContent = `Mode: ${mode}`;
}
