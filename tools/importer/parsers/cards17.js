/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if element is a grid of cards
  if (!element || !element.classList.contains('w-layout-grid')) return;

  // Header row for the block table (must be exactly one column)
  const headerRow = ['Cards (cards17)'];

  // Get all immediate children (each card is a div.utility-aspect-1x1)
  const cardDivs = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1'));

  // Each card: first cell is the image, second cell is the alt text (as description)
  const rows = cardDivs.map(cardDiv => {
    const img = cardDiv.querySelector('img');
    if (!img) return null;
    // Use the alt attribute as the text content for the second cell
    const altText = img.alt || '';
    // If alt text is empty, use a fallback description
    const description = altText.trim() ? altText : 'Card image';
    // Wrap the description in a <p> for better structure
    const descElem = document.createElement('p');
    descElem.textContent = description;
    return [img, descElem];
  }).filter(Boolean);

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
