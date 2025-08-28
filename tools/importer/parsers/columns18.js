/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid with columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get only direct children (should be two: left content block, right image block)
  const gridChildren = Array.from(grid.children);

  // LEFT COLUMN: Content block
  // Should contain a div with headings/text and a ul with contact methods
  // We'll identify the div that has heading and paragraph
  let leftContentDiv = null;
  let contactsUl = null;

  for (const child of gridChildren) {
    if (child.tagName === 'DIV' && child.querySelector('h2') && child.querySelector('h3')) {
      leftContentDiv = child;
    }
    if (child.tagName === 'UL') {
      contactsUl = child;
    }
  }

  // Compose left column: combine the info div and the contacts list in order
  const leftCol = document.createElement('div');
  if (leftContentDiv) leftCol.appendChild(leftContentDiv);
  if (contactsUl) leftCol.appendChild(contactsUl);

  // RIGHT COLUMN: The image (should be last child of grid)
  let rightCol = null;
  for (const child of gridChildren) {
    if (child.tagName === 'IMG') {
      rightCol = child;
      break;
    }
  }
  // Edge case: If no image found, leave column empty

  // Build the table as per block guidelines
  // Header (must match EXACTLY):
  const headerRow = ['Columns (columns18)'];
  // Second row: two columns, left and right
  const contentRow = [leftCol, rightCol || ''];

  // Construct table
  const cells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
