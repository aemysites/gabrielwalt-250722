/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the two columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get the two columns: image and content
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // First column: image element (reference, not clone)
  const imageEl = columns[0];
  // Second column: content (reference, not clone)
  const contentEl = columns[1];

  // Table header row must match block name exactly
  const headerRow = ['Columns (columns32)'];
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
