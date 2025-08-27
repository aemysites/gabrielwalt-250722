/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example exactly
  const headerRow = ['Cards (cards23)'];
  const cardsRows = [];

  // Find all tab panes (each containing grid of cards)
  const tabPanes = Array.from(element.querySelectorAll(':scope > div'));

  for (const tabPane of tabPanes) {
    // Each tabPane contains a grid of cards
    const grid = tabPane.querySelector('.w-layout-grid');
    if (!grid) continue;
    // All <a> elements are card containers
    const cardAnchors = Array.from(grid.querySelectorAll(':scope > a'));
    for (const card of cardAnchors) {
      // --- First cell: Image ---
      // Find img inside card (if present)
      const img = card.querySelector('img');
      const imageCell = img || '';

      // --- Second cell: Text ---
      // Try to get the heading and description in-order
      // Heading: <h3> or .h4-heading (sometimes nested)
      let heading = card.querySelector('h3, .h4-heading');
      if (!heading) {
        // Sometimes heading is nested deeper (e.g. .utility-text-align-center)
        heading = card.querySelector('.utility-text-align-center h3, .utility-text-align-center .h4-heading');
      }
      // Description: .paragraph-sm (sometimes nested)
      let descr = card.querySelector('div.paragraph-sm');
      if (!descr) {
        descr = card.querySelector('.utility-text-align-center .paragraph-sm');
      }

      // Compose text cell: heading (if exists), then description (if exists)
      const textCell = [];
      if (heading) textCell.push(heading);
      if (descr) textCell.push(descr);
      // Edge case: if both missing, leave cell blank

      cardsRows.push([imageCell, textCell.length ? textCell : '']);
    }
  }

  // Compose table: header row, then all card rows
  const cells = [headerRow, ...cardsRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
