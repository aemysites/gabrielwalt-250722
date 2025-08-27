/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child divs (representing columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // For each column, extract its main content (usually a single child)
  const cells = columns.map(col => {
    if (col.children.length === 1) {
      return col.firstElementChild;
    }
    return col;
  });
  // Header row should have N columns: first cell is header, rest empty
  const headerRow = ['Columns (columns29)', ...Array(cells.length - 1).fill('')];
  const tableRows = [
    headerRow,
    cells
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}