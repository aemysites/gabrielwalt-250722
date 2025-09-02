/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main grid container (holds text and image)
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Find the image (background/hero image)
  const img = grid.querySelector('img');

  // Find the text container (contains heading, paragraph, buttons)
  // The first child grid contains the text block
  const innerGrid = grid.querySelector('.container');
  let contentBlock = null;
  if (innerGrid) {
    // The actual content is inside the first child div of innerGrid
    const contentDiv = innerGrid.querySelector('.section');
    if (contentDiv) {
      // We'll reference the entire contentDiv for text/buttons
      contentBlock = contentDiv;
    }
  }

  // Table header
  const headerRow = ['Hero (hero5)'];
  // Second row: image (if present)
  const imageRow = [img ? img : ''];
  // Third row: text content (heading, paragraph, buttons)
  const contentRow = [contentBlock ? contentBlock : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
