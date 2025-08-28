/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Tabs block
  const headerRow = ['Tabs'];

  // Find tab menu and tab content containers
  const tabMenu = Array.from(element.children).find(child => child.classList.contains('w-tab-menu'));
  const tabContent = Array.from(element.children).find(child => child.classList.contains('w-tab-content'));

  if (!tabMenu || !tabContent) {
    // If either menu or content is missing, do not proceed
    return;
  }

  // Extract tab labels
  const tabLinks = Array.from(tabMenu.children).filter(link => link.getAttribute('role') === 'tab');
  // Extract tab panes
  const tabPanes = Array.from(tabContent.children).filter(pane => pane.getAttribute('role') === 'tabpanel');

  // Defensive: if the number of links and panes is not equal, fallback to matching by index, up to the shortest length
  const tabCount = Math.min(tabLinks.length, tabPanes.length);

  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    const link = tabLinks[i];
    // Tab label is the inner text of the child div, or fallback to link text
    let label = '';
    const labelDiv = link.querySelector('div');
    if (labelDiv && labelDiv.textContent) {
      label = labelDiv.textContent.trim();
    } else {
      label = link.textContent.trim();
    }
    // For tab content, use the grid-layout if present, else the pane contents
    let pane = tabPanes[i];
    let content = pane.querySelector('.w-layout-grid') || pane;
    rows.push([label, content]);
  }

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
