/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per instructions and example
  const headerRow = ['Accordion (accordion13)'];
  const rows = [];

  // Each direct child with class 'divider' is an accordion item
  const dividers = Array.from(element.querySelectorAll(':scope > .divider'));
  dividers.forEach(divider => {
    // Each .divider contains a .grid-layout div
    const grid = divider.querySelector('.grid-layout');
    if (grid) {
      // Collect all direct children of .grid-layout (should be two: title and content)
      const children = Array.from(grid.children);
      let titleEl = null;
      let contentEl = null;
      // Find by class
      children.forEach(child => {
        if (child.classList.contains('h4-heading')) {
          titleEl = child;
        } else if (child.classList.contains('rich-text')) {
          contentEl = child;
        }
      });
      // Only add row if both present (defensive)
      if (titleEl && contentEl) {
        rows.push([titleEl, contentEl]);
      }
    }
  });
  
  // Compose the table data: header row + accordion rows
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
