/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns38)'];

  // Get all immediate child divs (columns)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, place the entire column div in the table cell to preserve all content
  const cells = columnDivs;

  // Create the table with the header and column row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cells
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
