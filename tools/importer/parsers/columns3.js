/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const columns = Array.from(grid.children);
  if (!columns.length) return;

  // Create the table using createTable
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns3)'], // header row, single cell
    columns, // content row: one cell per column
  ], document);

  // Set the header cell to span all columns
  const th = table.querySelector('th');
  if (th && columns.length > 1) {
    th.setAttribute('colspan', columns.length);
  }

  // Replace the original element
  element.replaceWith(table);
}
