/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Get the main grid container (contains the two columns)
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get the immediate children of the grid (should be two: image and content)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // First column: image
  const imageEl = columns[0];
  // Second column: content (heading, subheading, buttons)
  const contentEl = columns[1];

  // Table header row
  const headerRow = ['Columns (columns1)'];
  // Table content row: two columns
  const contentRow = [imageEl, contentEl];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
