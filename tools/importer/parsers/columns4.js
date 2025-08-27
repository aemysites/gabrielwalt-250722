/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: always a single cell
  const headerRow = ['Columns (columns4)'];

  // Get the direct child divs of the grid (each is a column block)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, gather all its visible immediate children (not just images)
  const colContent = columns.map(col => {
    // If the column has only one child, just use it
    // If it has more, collect them all
    const children = Array.from(col.childNodes).filter(node => {
      // Only include elements and text nodes with non-whitespace text
      return (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') ||
             (node.nodeType === 3 && node.textContent.trim());
    });
    // If only one, use that, else array
    if (children.length === 1) return children[0];
    if (children.length > 1) return children;
    // If nothing, empty string
    return '';
  });

  // Table structure: header row is single cell, 2nd row is columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    colContent
  ], document);

  // Replace the original element with the created table
  element.replaceWith(table);
}
