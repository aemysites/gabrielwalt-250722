/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout for columns
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // For left column: gather all content (headings, paragraphs, buttons)
  // Reference the element directly so all text and structure is included
  const leftCell = columns[0];
  // For right column: reference the element directly (image, etc)
  const rightCell = columns[1];

  // Table header must match the example exactly and be a single column
  const headerRow = ['Columns (columns15)'];
  // Second row with two columns containing all actual content from the original
  const secondRow = [leftCell, rightCell];

  // Build the table block
  const table = WebImporter.DOMUtils.createTable([headerRow, secondRow], document);
  // Replace the original element
  element.replaceWith(table);
}
