/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Block header row as per block spec
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // Find tab menu and tab content containers
  const tabMenu = element.querySelector('.w-tab-menu');
  const tabContent = element.querySelector('.w-tab-content');
  if (!tabMenu || !tabContent) return;

  // Get tab labels
  const tabLinks = Array.from(tabMenu.querySelectorAll('a'));
  // Get tab panes
  const tabPanes = Array.from(tabContent.children).filter(child => child.classList.contains('w-tab-pane'));

  // Defensive: ensure tab count matches
  const tabCount = Math.min(tabLinks.length, tabPanes.length);

  for (let i = 0; i < tabCount; i++) {
    // Tab label: use the inner text of the tab link's child div
    let label = '';
    const labelDiv = tabLinks[i].querySelector('div');
    if (labelDiv) {
      label = labelDiv.textContent.trim();
    } else {
      label = tabLinks[i].textContent.trim();
    }

    // Tab content: use the main content grid inside the pane
    let contentDiv = tabPanes[i].querySelector('div');
    if (!contentDiv) contentDiv = tabPanes[i];

    // Reference the existing element (do not clone)
    rows.push([label, contentDiv]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
