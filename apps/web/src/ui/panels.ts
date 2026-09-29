const PHONE = '(max-width: 639px)';

/** On small screens, opening one panel closes the others so the map stays visible. */
export function onePanelAtATimeOnPhones(panels: HTMLDetailsElement[]): void {
  const phone = window.matchMedia(PHONE);
  for (const panel of panels) {
    panel.addEventListener('toggle', () => {
      if (!panel.open || !phone.matches) return;
      for (const other of panels) if (other !== panel) other.open = false;
    });
  }
}
