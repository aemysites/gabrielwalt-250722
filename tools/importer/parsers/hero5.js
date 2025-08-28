/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Hero (hero5)'];

  // Find the main image (background/hero image)
  const img = element.querySelector('img');
  // If the image is missing, handle gracefully
  const imageCell = img ? [img] : [''];

  // Find the inner content block (text, heading, buttons)
  let contentDiv = null;
  // The relevant content is inside the grid '.container', then first child div
  const innerGrid = element.querySelector('.container');
  if (innerGrid) {
    // Find the direct child div (the one with heading, text, buttons)
    // Could also have different classnames, so use direct child
    const firstDiv = innerGrid.querySelector(':scope > div');
    if (firstDiv) contentDiv = firstDiv;
  }
  // If content is missing, handle gracefully
  const contentCell = contentDiv ? [contentDiv] : [''];

  // Create the table structure per block guidelines
  const cells = [
    headerRow,
    imageCell,
    contentCell,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
