/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure header row is exactly one cell as per requirements
  const headerRow = ['Columns (columns4)'];
  
  // Get all direct children representing columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each cell should contain the entire column (div), not just the image, to preserve possible future content
  const contentRow = columns.map(col => col);

  // Table structure: header row (one cell), content row (each column as a cell)
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
