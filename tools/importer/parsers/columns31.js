/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid of columns inside the container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get direct children of the grid layout (these are the columns)
  const columns = Array.from(grid.children);
  if (columns.length === 0) return;

  // Header row: must match example exactly, and be a single cell
  const headerRow = ['Columns (columns31)'];

  // Each column becomes a cell in the second row
  const contentRow = columns;

  // Compose the table with a single header cell, then content row with N columns
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
