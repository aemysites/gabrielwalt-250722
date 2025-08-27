/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  // Get immediate children of the grid (should be image and content columns)
  const columns = Array.from(grid.children).filter(child => child.nodeType === 1);
  if (columns.length === 0) return;

  // Header row per table guidelines
  const headerRow = ['Columns (columns1)'];
  // Second row: one cell per column, each containing the referenced existing element
  const contentRow = columns;
  
  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element with the generated table
  element.replaceWith(table);
}
