/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure the element exists
  if (!element) return;

  // Header row as specified
  const headerRow = ['Hero (hero20)'];

  // --- Background Images ---
  // Find the grid of images (background collage)
  let imagesContainer = null;
  let images = [];
  // Find the first .ix-hero-scale-3x-to-1x div (contains the collage)
  imagesContainer = element.querySelector('.ix-hero-scale-3x-to-1x');
  if (imagesContainer) {
    // All images inside the grid-layout
    const grid = imagesContainer.querySelector('.grid-layout');
    if (grid) {
      images = Array.from(grid.querySelectorAll('img'));
    }
  }
  // Defensive: only add images if found
  let backgroundCell = images.length ? images : '';

  // --- Content (Title, Subheading, CTA) ---
  // Find the content container
  let contentContainer = element.querySelector('.ix-hero-scale-3x-to-1x-content');
  let contentCell = '';
  if (contentContainer) {
    // The actual content is inside .container
    const innerContent = contentContainer.querySelector('.container');
    if (innerContent) {
      // Gather heading, subheading, and button group
      const heading = innerContent.querySelector('h1');
      const subheading = innerContent.querySelector('p');
      const buttonGroup = innerContent.querySelector('.button-group');
      // Compose cell content
      const cellContent = [];
      if (heading) cellContent.push(heading);
      if (subheading) cellContent.push(subheading);
      if (buttonGroup) cellContent.push(buttonGroup);
      contentCell = cellContent.length ? cellContent : '';
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [backgroundCell],
    [contentCell],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
