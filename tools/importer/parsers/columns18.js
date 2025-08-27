/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get grid children
  const children = Array.from(grid.children);

  let leftContent = document.createElement('div');
  let rightContent = null;

  // Gather left column: text and contacts; right column: image
  children.forEach(child => {
    if (child.tagName === 'DIV' || child.tagName === 'UL') {
      leftContent.appendChild(child);
    } else if (child.tagName === 'IMG') {
      rightContent = child;
    }
  });

  // If leftContent is empty, fallback
  if (!leftContent.hasChildNodes()) {
    children.forEach(child => {
      if (child !== rightContent) {
        leftContent.appendChild(child);
      }
    });
  }

  // Fix: header row must be a single cell, exactly as in the example
  const headerRow = ['Columns (columns18)'];

  // Content row: two columns
  const contentRow = [leftContent, rightContent];

  // Compose table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
