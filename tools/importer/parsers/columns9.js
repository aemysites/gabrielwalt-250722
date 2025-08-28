/* global WebImporter */
export default function parse(element, { document }) {
  // Get the grid-layout element, which contains the four main footer columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get all direct children (columns)
  const cols = Array.from(grid.children);
  if (cols.length < 4) return;

  // The example markdown groups as:
  // [logo+social, Trends]
  // [Inspire, Explore]
  const headerRow = ['Columns (columns9)'];
  const row1 = [cols[0], cols[1]];
  const row2 = [cols[2], cols[3]];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row1,
    row2
  ], document);
  element.replaceWith(table);
}
