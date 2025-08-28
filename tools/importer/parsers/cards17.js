/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Cards (cards17)'];

  // Each card: div.utility-aspect-1x1 (each contains an img)
  const cardDivs = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1'));

  // Build rows: each row has image, and empty cell for text (since only images, no text in provided HTML)
  const rows = cardDivs.map(div => {
    const img = div.querySelector('img');
    // Reference the existing image element directly
    return [img, ''];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the old element
  element.replaceWith(block);
}
