/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text content from a card anchor
  function extractCardContent(cardAnchor) {
    // Find image container (may be nested)
    const imgContainer = cardAnchor.querySelector('.utility-aspect-2x3, .utility-aspect-1x1');
    let imgEl = imgContainer ? imgContainer.querySelector('img') : null;
    // Defensive: fallback to any img if not found
    if (!imgEl) {
      imgEl = cardAnchor.querySelector('img');
    }
    // Find heading (h3)
    const heading = cardAnchor.querySelector('h3');
    // Find description (p)
    const desc = cardAnchor.querySelector('p');
    // Find CTA (button or .button)
    let cta = cardAnchor.querySelector('button, .button');
    // Compose text cell
    const textCell = [];
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);
    return [imgEl, textCell];
  }

  // Find the grid containing all cards
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout');
  // Defensive: fallback to direct children if grid not found
  const cardNodes = mainGrid
    ? Array.from(mainGrid.children)
    : Array.from(element.querySelectorAll(':scope > *'));

  // Compose table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards37)']);

  // For each card anchor (skip non-anchor nodes)
  cardNodes.forEach((node) => {
    // Some cards are nested inside another grid
    if (node.classList.contains('w-layout-grid')) {
      // Nested grid: find all anchors inside
      Array.from(node.querySelectorAll('a.utility-link-content-block')).forEach((anchor) => {
        rows.push(extractCardContent(anchor));
      });
    } else if (node.tagName === 'A' && node.classList.contains('utility-link-content-block')) {
      rows.push(extractCardContent(node));
    }
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
