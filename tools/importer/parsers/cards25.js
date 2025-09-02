/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a grid item
  function extractCardContent(cardEl) {
    // Find the main image (always present)
    const img = cardEl.querySelector('img');
    // Find the content wrapper (may be missing for simple image cards)
    const contentWrapper = cardEl.querySelector('.utility-padding-all-2rem');
    let title = null;
    let desc = null;
    if (contentWrapper) {
      title = contentWrapper.querySelector('h3');
      desc = contentWrapper.querySelector('p');
    }
    // Compose the text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    // Defensive: If no text, leave cell empty
    return [img, textCell.length ? textCell : ''];
  }

  // Always start with the block header
  const cells = [ ['Cards (cards25)'] ];

  // Get all direct children (cards) of the grid
  const cardNodes = Array.from(element.querySelectorAll(':scope > div'));

  cardNodes.forEach(cardEl => {
    // Only process if there's an image
    const img = cardEl.querySelector('img');
    if (!img) return; // skip if no image
    const row = extractCardContent(cardEl);
    cells.push(row);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
