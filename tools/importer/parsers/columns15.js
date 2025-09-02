/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout containing the two columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get the immediate children of the grid (should be two columns)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // First column: text content (heading, subheading, buttons)
  const leftCol = columns[0];
  // Second column: image
  const rightCol = columns[1];

  // --- Left column content ---
  // Instead of just including leftCol, extract all its main content blocks for flexibility
  const leftContent = [];
  // Heading
  const heading = leftCol.querySelector('h1');
  if (heading) leftContent.push(heading.cloneNode(true));
  // Subheading
  const subheading = leftCol.querySelector('.subheading');
  if (subheading) leftContent.push(subheading.cloneNode(true));
  // Button group
  const buttonGroup = leftCol.querySelector('.button-group');
  if (buttonGroup) leftContent.push(buttonGroup.cloneNode(true));

  // --- Right column content ---
  // Find the main image in the right column
  let mainImage = rightCol.querySelector('img');
  // Defensive: If no image, fallback to rightCol itself
  const rightCellContent = mainImage ? mainImage.cloneNode(true) : rightCol.cloneNode(true);

  // --- Table structure ---
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftContent, rightCellContent];

  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
