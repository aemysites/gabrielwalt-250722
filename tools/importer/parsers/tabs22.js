/* global WebImporter */
export default function parse(element, { document }) {
  // Get tab labels
  const tabMenu = element.querySelector('.w-tab-menu');
  const tabLinks = tabMenu ? tabMenu.querySelectorAll('a') : [];
  // Get all tab panes
  const tabContent = element.querySelector('.w-tab-content');
  const tabPanes = tabContent ? tabContent.querySelectorAll('.w-tab-pane') : [];

  // Table header matches block name exactly
  const headerRow = ['Tabs'];
  const rows = [headerRow];

  // For each tab (order in tabLinks and tabPanes matches)
  for (let i = 0; i < tabLinks.length && i < tabPanes.length; i++) {
    // Reference the displayed tab label element directly (div inside a)
    const labelDiv = tabLinks[i].querySelector('div') || tabLinks[i];
    // Reference the content grid inside the pane, or the pane itself if missing
    let contentEl = tabPanes[i].querySelector('div');
    if (!contentEl) contentEl = tabPanes[i];
    rows.push([
      labelDiv,
      contentEl
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
