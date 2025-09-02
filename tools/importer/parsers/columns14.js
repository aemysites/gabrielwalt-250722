/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the grid container (columns wrapper)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid (these are the columns)
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Header row as required
  const headerRow = ['Columns (columns14)'];

  // Second row: each cell is a column's content
  // For this block, we want to preserve the entire content of each column
  const contentRow = columns.map(col => col);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
