/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly matches the example
  const headerRow = ['Accordion (accordion13)'];
  // Prepare rows for each accordion item
  const rows = [];
  // The relevant accordion items are inside immediate child .divider elements
  const dividers = element.querySelectorAll(':scope > .divider');
  dividers.forEach(divider => {
    // Each divider contains a .grid-layout with two children: title and content
    const grid = divider.querySelector('.grid-layout');
    if (grid) {
      // Get all immediate children of the grid
      const gridChildren = grid.querySelectorAll(':scope > div');
      if (gridChildren.length >= 2) {
        const titleElem = gridChildren[0];
        const contentElem = gridChildren[1];
        // Add a row to the table, referencing existing elements
        rows.push([titleElem, contentElem]);
      }
    }
  });
  // Compose block table: header row, then each accordion item row
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
