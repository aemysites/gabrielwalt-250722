/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get the two columns: content and image
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // First column: content (text, headings, button)
  const contentCol = columns[0];
  // Second column: image
  const imageCol = columns[1];

  // Table header row must match block name exactly
  const headerRow = ['Columns (columns27)'];

  // Table second row: reference actual elements for each column
  const secondRow = [contentCol, imageCol];

  // Create the table with correct structure
  const table = WebImporter.DOMUtils.createTable([headerRow, secondRow], document);

  // Replace the original section with the table
  element.replaceWith(table);
}
