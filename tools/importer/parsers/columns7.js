/* global WebImporter */
export default function parse(element, { document }) {
  // Block header must match exactly
  const headerRow = ['Columns (columns7)'];

  // Find all direct children (columns)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, extract the image element (preserving semantic meaning)
  const columns = columnDivs.map(div => {
    const img = div.querySelector('img');
    // Defensive: if image exists, use it directly (reference, not clone)
    if (img) return img;
    // If no image, preserve any text content
    if (div.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = div.textContent.trim();
      return span;
    }
    // If empty, insert an empty cell
    return document.createElement('span');
  });

  // Table rows: header, then columns
  const rows = [headerRow, columns];

  // Create the table using DOMUtils
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
