/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Block header row as per spec
  const headerRow = ['Columns (columns38)'];

  // Second row: each cell is the full column div (preserving images and semantics)
  const contentRow = columns.map(col => col);

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original grid with the block table
  element.replaceWith(table);
}
