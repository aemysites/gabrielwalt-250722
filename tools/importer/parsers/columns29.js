/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find all column divs (immediate children)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // 2. For each column, extract the img (or use entire content)
  const rowCells = columns.map(col => {
    const img = col.querySelector('img');
    return img ? img : col;
  });

  // 3. Compose cells: header row is a single cell array, second row is the columns array
  const cells = [
    ['Columns (columns29)'], // header row: single cell, matching example
    rowCells                // content row: one cell per column
  ];

  // 4. Create the table and set colspan on the header cell
  const table = WebImporter.DOMUtils.createTable(cells, document);
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', rowCells.length);
  }

  // 5. Replace the original element
  element.replaceWith(table);
}
