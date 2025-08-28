/* global WebImporter */
export default function parse(element, { document }) {
  // The block header: single column, matching the example
  const headerRow = ['Columns (columns30)'];

  // Locate the main grid containing column content
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const columnDivs = Array.from(grid.children);

  // The example markdown shows three columns in the first content row:
  //  1. Left: Text block with title, list and button (in the example)
  //  2. Middle: Image
  //  3. Right: Image and text/button
  // For our HTML, distribute the content to best match the semantic intention:
  //  1. Left: Name, tags
  //  2. Middle: Heading
  //  3. Right: Rich text

  // Compose left cell (name & tags)
  const leftCell = document.createElement('div');
  if (columnDivs[0]) leftCell.appendChild(columnDivs[0]);
  if (columnDivs[1]) leftCell.appendChild(columnDivs[1]);

  // Compose middle cell (heading)
  const middleCell = document.createElement('div');
  if (columnDivs[2]) middleCell.appendChild(columnDivs[2]);

  // Compose right cell (rich text)
  const rightCell = document.createElement('div');
  if (columnDivs[3]) rightCell.appendChild(columnDivs[3]);

  // Compose the table structure: single header column, single row of three columns
  const tableCells = [
    headerRow,
    [leftCell, middleCell, rightCell],
  ];

  // Create table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
