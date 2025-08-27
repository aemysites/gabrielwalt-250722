/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid-layout containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Gather all immediate children of the grid as columns
  const columns = Array.from(grid.children);

  // Header row: single cell, regardless of column count
  const headerRow = ['Columns (columns31)'];

  // Content row: one cell for each column
  const contentRow = columns.map(col => col);

  // Table rows: header then content
  const cells = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
