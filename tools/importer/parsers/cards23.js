/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract one grid of cards
  function extractCards(grid) {
    const cards = [];
    // Each direct child is a card (usually <a>)
    const cardEls = grid.querySelectorAll(':scope > a');
    cardEls.forEach(cardEl => {
      // Try to find the image
      let img = cardEl.querySelector('img');
      // Try to find the title and description
      let heading = cardEl.querySelector('h3, h2, h4, h5');
      let desc = cardEl.querySelector('.paragraph-sm');

      // In some cases, heading and desc are inside an extra wrapper
      if (!heading || !desc) {
        const inner = cardEl.querySelector('.utility-text-align-center');
        if (inner) {
          heading = inner.querySelector('h3, h2, h4, h5') || heading;
          desc = inner.querySelector('.paragraph-sm') || desc;
        }
      }

      // Compose text cell: heading (bold), then description
      const textNodes = [];
      if (heading) {
        // Use original heading element for semantic meaning
        textNodes.push(heading);
      }
      if (desc) {
        // Add <br> if both heading and desc exist
        if (heading) textNodes.push(document.createElement('br'));
        textNodes.push(desc);
      }
      // If no heading and no desc, fallback to cardEl.textContent
      if (!heading && !desc) {
        textNodes.push(document.createTextNode(cardEl.textContent.trim()));
      }
      cards.push([
        img || '',
        textNodes
      ]);
    });
    return cards;
  }

  // Each tab-pane corresponds to a block-table
  const tabPanes = element.querySelectorAll(':scope > div');
  tabPanes.forEach(tabPane => {
    const grid = tabPane.querySelector('.w-layout-grid');
    if (grid) {
      const cells = [['Cards (cards23)']];
      const cardRows = extractCards(grid);
      cells.push(...cardRows);
      const block = WebImporter.DOMUtils.createTable(cells, document);
      grid.parentNode.replaceChild(block, grid);
    }
  });
}
