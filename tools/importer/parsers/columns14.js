/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.grid-layout');
  let columnsRow = [];
  if (grid) {
    // Get columns as direct children of the grid
    columnsRow = Array.from(grid.children);
  } else {
    // fallback: use direct children of main element
    columnsRow = Array.from(element.children);
  }
  // The header row must be a single column, regardless of column count
  const headerRow = ['Columns (columns14)'];
  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  // Replace the original element with the table
  element.replaceWith(table);
}
