/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout inside the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Collect all top-level grid children as columns
  const columns = Array.from(grid.children);
  // Compose the table as per spec:
  // Header row
  const headerRow = ['Columns (columns32)'];
  // Content row: each grid column is a cell, reference the live element
  const contentRow = columns.map((col) => col);
  // Only include columns that are element nodes
  const filteredContentRow = contentRow.filter((col) => col && col.nodeType === 1);
  const cells = [
    headerRow,
    filteredContentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
