/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main layout grid/container
  const grid = element.querySelector('.grid-layout');
  const columns = [];

  if (grid) {
    // Only direct children of the grid-layout should be columns
    const directColumnNodes = Array.from(grid.children);
    directColumnNodes.forEach((colNode) => {
      columns.push(colNode);
    });
  } else {
    // Fallback: treat immediate children of the section as columns (rare)
    Array.from(element.children).forEach((child) => {
      columns.push(child);
    });
  }
  // Guarantee at least one column
  if (columns.length === 0) columns.push(element);

  // Compose the table
  const headerRow = ['Columns (columns27)'];
  // Each column is a cell in the second row
  const tableRows = [headerRow, columns];

  // Create the block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
