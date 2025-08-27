/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name
  const headerRow = ['Columns (columns38)'];

  // Get all immediate child divs (columns)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Reference the original column divs for each cell,
  // Not just a child image or sub-element, to preserve all content
  const row = columnDivs;

  // Assemble the cells
  const cells = [
    headerRow,
    row
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
