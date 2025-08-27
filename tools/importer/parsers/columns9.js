/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Columns (columns9)'];

  // Find the main grid containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const columns = Array.from(grid.children);

  // Column 1: logo and social links (first child)
  const col1 = columns[0];

  // Column 2: merge all subsequent columns (usually lists) into a single wrapper
  const col2Wrapper = document.createElement('div');
  for (let i = 1; i < columns.length; i++) {
    // Move (not clone!) the subsequent columns into the wrapper
    while (columns[i].childNodes.length) {
      col2Wrapper.appendChild(columns[i].childNodes[0]);
    }
  }

  // Compose table: header row + single content row with two columns
  const cells = [headerRow, [col1, col2Wrapper]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
