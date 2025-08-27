/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid wrapper containing columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all immediate children of grid (should be 2: left content and right image)
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // Left column: the div with text and button
  const leftContent = columns.find(c => c.tagName === 'DIV');
  // Right column: the image
  const rightImage = columns.find(c => c.tagName === 'IMG');

  // Defensive: Ensure both are found
  if (!leftContent || !rightImage) return;

  // Compose the left cell's content: pass ALL child nodes in order and filter only elements
  const leftCellContent = Array.from(leftContent.childNodes).filter(node => node.nodeType === 1);
  // Compose the right cell's content: the existing img element
  const rightCellContent = rightImage;

  // Compose the cells per block table spec
  const cells = [
    ['Columns (columns27)'],
    [leftCellContent, rightCellContent],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
