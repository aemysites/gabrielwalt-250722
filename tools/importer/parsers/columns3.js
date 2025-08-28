/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout (the columns container)
  const grid = element.querySelector('.w-layout-grid.grid-layout');
  if (!grid) return;

  // Get immediate children of the grid (these are the columns)
  const columns = Array.from(grid.children);

  // Block name as header row, matching example exactly
  const headerRow = ['Columns (columns3)'];

  // Create the row for columns. Each column cell contains ALL content from the source column.
  // Reference source elements directly (not cloning)
  const contentRow = columns.map((col) => {
    // If a column is empty, represent as an empty div
    if (!col.childNodes.length) {
      const emptyDiv = document.createElement('div');
      return emptyDiv;
    }
    // Wrap all nodes from the column in a div for semantic grouping
    const wrapper = document.createElement('div');
    while (col.firstChild) {
      wrapper.appendChild(col.firstChild);
    }
    return wrapper;
  });

  // Build table array
  const tableRows = [headerRow, contentRow];

  // Create block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original section element with the block table
  element.replaceWith(blockTable);
}
