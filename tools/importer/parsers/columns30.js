/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout that contains the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get the immediate children of the grid
  const gridChildren = Array.from(grid.children);
  // Defensive: Only proceed if we have at least 4 children (otherwise, data is missing)
  if (gridChildren.length < 4) return;

  // 1st column: name (Taylor Brooks)
  const col1 = gridChildren[0];
  // 2nd column: tags (vertical flex with .tag divs)
  const col2 = gridChildren[1];
  // 3rd column: heading (h2)
  const col3 = gridChildren[2];
  // 4th column: rich text (paragraph content)
  const col4 = gridChildren[3];

  // Structure: 3 columns in the example screenshot:
  // Left: Name
  // Center: Tags + Heading
  // Right: Paragraphs

  // To combine tags and heading into one cell, create a wrapper div and reference existing elements
  const centerCell = document.createElement('div');
  centerCell.appendChild(col2); // tags
  centerCell.appendChild(col3); // heading

  // The right cell is the paragraphs
  const rightCell = col4;

  // The left cell is the name
  const leftCell = col1;

  // Compose the table rows
  const cells = [
    ['Columns (columns30)'],
    [leftCell, centerCell, rightCell]
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
