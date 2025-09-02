/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children (each column)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, find the image (if present)
  const cells = columns.map((col) => {
    const img = col.querySelector('img');
    // Only include the image if it exists
    return img ? img : '';
  });

  // Table rows: header, then columns
  const tableRows = [
    ['Columns (columns29)'], // Header row
    cells                   // Columns row
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
