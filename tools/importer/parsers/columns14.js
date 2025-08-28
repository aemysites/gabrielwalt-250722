/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout container
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get immediate children of the grid (these are the columns)
  const cols = Array.from(grid.children);
  if (cols.length === 0) return;

  // Header: exactly one cell, as required
  const headerRow = ['Columns (columns14)'];

  // Content: each column's content as a cell in the second row
  const cells = [headerRow, cols];

  // Create table with exact header row structure
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
