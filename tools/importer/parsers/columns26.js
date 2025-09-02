/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main grid containing the two columns
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // First two children are the two columns (left and right)
  // Defensive: check for at least two children
  if (gridChildren.length < 2) return;

  // First row: block name
  const headerRow = ['Columns (columns26)'];

  // Second row: two columns (left and right)
  // Left column: heading (h2) and below, avatar row
  // Right column: quote and below, logo row

  // Left column: heading and avatar row
  const leftCol = document.createElement('div');
  leftCol.appendChild(gridChildren[0]); // heading

  // Find the nested grid for the avatar row (should be the third child)
  if (gridChildren.length > 2) {
    const nestedGrid = gridChildren[2];
    // Defensive: find the flex row for avatar and name
    const flexRow = nestedGrid.querySelector('.flex-horizontal');
    if (flexRow) {
      leftCol.appendChild(flexRow);
    }
  }

  // Right column: quote and logo row
  const rightCol = document.createElement('div');
  rightCol.appendChild(gridChildren[1]); // quote

  if (gridChildren.length > 2) {
    const nestedGrid = gridChildren[2];
    // Defensive: find the logo (svg) container
    const logoDiv = nestedGrid.querySelector('.utility-display-inline-block');
    if (logoDiv) {
      rightCol.appendChild(logoDiv);
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftCol, rightCol],
  ];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
