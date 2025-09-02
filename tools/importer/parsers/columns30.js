/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // If there are no columns, do not proceed
  if (!columns.length) return;

  // Prepare the header row with the exact block name
  const headerRow = ['Columns (columns30)'];

  // Each cell should reference the actual DOM node from the column
  const columnsRow = columns.map((col) => col);

  // Build the table using the WebImporter utility
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original section with the new table
  element.replaceWith(table);
}
