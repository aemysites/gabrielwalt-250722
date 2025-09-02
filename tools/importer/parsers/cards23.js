/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text from a card anchor
  function extractCardContent(card) {
    let imgEl = null;
    let textEls = [];
    // Find image (if present)
    imgEl = card.querySelector('img');
    // Find heading and description
    const heading = card.querySelector('h3');
    const desc = card.querySelector('.paragraph-sm');
    if (heading) textEls.push(heading);
    if (desc) textEls.push(desc);
    return [imgEl, textEls];
  }

  // Find all tab panes (each tab contains a grid of cards)
  const tabPanes = element.querySelectorAll(':scope > div');
  const rows = [];
  const headerRow = ['Cards (cards23)'];
  rows.push(headerRow);

  tabPanes.forEach(tabPane => {
    // Find the grid inside each tab
    const grid = tabPane.querySelector('.w-layout-grid');
    if (!grid) return;
    // Each card is an anchor
    const cards = grid.querySelectorAll(':scope > a');
    cards.forEach(card => {
      // Defensive: skip if no heading or description
      const [imgEl, textEls] = extractCardContent(card);
      // Only add if both image and text are present
      if (imgEl && textEls.length) {
        rows.push([imgEl, textEls]);
      } else if (textEls.length) {
        // If no image, just text (shouldn't happen in this block, but for resilience)
        rows.push(['', textEls]);
      }
    });
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
