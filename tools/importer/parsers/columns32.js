/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid (should be 2 for this layout)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return; // Robustness: ensure there are at least 2 columns

  // Table structure: header row, then one row with 2 columns
  const headerRow = ['Columns (columns32)'];
  const contentRow = [columns[0], columns[1]];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
