/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists
  if (!element || !document) return;

  // Header row for the block table
  const headerRow = ['Columns (columns4)'];

  // Get all immediate child divs (each column cell)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract the main content (here, each contains an image)
  // We'll use the entire div as the cell content to preserve structure and be resilient to variations
  const columnsRow = columnDivs.map(div => div);

  // Build the table data
  const tableData = [
    headerRow,
    columnsRow
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
