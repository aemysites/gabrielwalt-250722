/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the background image (first img in the header)
  const bgImg = element.querySelector('img.cover-image');

  // Defensive: Find the card containing the text and CTA
  let card = null;
  const gridDivs = element.querySelectorAll(':scope > div');
  for (const gridDiv of gridDivs) {
    // Look for nested grid-layouts
    const innerGrids = gridDiv.querySelectorAll(':scope > div');
    for (const innerGrid of innerGrids) {
      // Card is the div with class 'card'
      const possibleCard = innerGrid.querySelector('.card');
      if (possibleCard) {
        card = possibleCard;
        break;
      }
    }
    if (card) break;
  }

  // Defensive fallback: If not found, try to find card anywhere
  if (!card) {
    card = element.querySelector('.card');
  }

  // Compose the table rows
  const headerRow = ['Hero (hero6)'];

  // Row 2: Background image (if present)
  const imageRow = [bgImg ? bgImg : ''];

  // Row 3: Card content (headline, subheading, CTA)
  const contentRow = [card ? card : ''];

  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
