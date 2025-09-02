/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the grid container with columns
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  // Get all immediate children of the grid (these are the columns)
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Build the header row
  const headerRow = ['Columns (columns9)'];

  // Build the columns row: each cell is the corresponding column content
  // We reference the original column elements directly for resilience
  const columnsRow = columns.map(col => col);

  // Compose the table cells array
  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
