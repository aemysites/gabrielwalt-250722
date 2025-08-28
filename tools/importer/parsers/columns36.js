/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const headerRow = ['Columns (columns36)'];

  // Find the outer grid (holds the two main columns)
  const container = element.querySelector('.container');
  const outerGrid = container && container.querySelector('.grid-layout');
  if (!outerGrid) return;

  // Find the two main columns
  const columns = Array.from(outerGrid.children);
  if (columns.length < 2) return;

  // LEFT COLUMN: content (h1, p, button group)
  const leftCol = columns[0];
  const leftParts = [];
  const h1 = leftCol.querySelector('h1');
  if (h1) leftParts.push(h1);
  const p = leftCol.querySelector('p');
  if (p) leftParts.push(p);
  const buttonGroup = leftCol.querySelector('.button-group');
  if (buttonGroup) leftParts.push(buttonGroup);

  // RIGHT COLUMN: all images
  const rightCol = columns[1];
  // The images are inside a grid inside the rightCol
  let images = [];
  const innerGrid = rightCol.querySelector('.grid-layout');
  if (innerGrid) {
    images = Array.from(innerGrid.querySelectorAll('img'));
  } else {
    images = Array.from(rightCol.querySelectorAll('img'));
  }

  // Compose table row: as many columns as needed (here, two)
  const contentRow = [leftParts, images];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
