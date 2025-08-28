/* global WebImporter */
export default function parse(element, { document }) {
  // Block table header
  const headerRow = ['Hero (hero28)'];

  // ---- Extract background image (row 2) ----
  // Look for the first <img> inside this block. If not found, row will be empty.
  const img = element.querySelector('img');
  const imgCell = img ? img : '';

  // ---- Extract content (row 3) ----
  // Find the content column: usually the second cell in grid-layout
  let contentCell = document.createElement('div');
  const gridDivs = element.querySelectorAll(':scope > .w-layout-grid > div');
  if (gridDivs.length > 1) {
    const contentContainer = gridDivs[1];
    // Copy all children of the top content container into the content cell
    Array.from(contentContainer.children).forEach(child => {
      contentCell.appendChild(child);
    });
    // If there is nothing, set to empty string
    if (!contentCell.hasChildNodes()) contentCell = '';
  } else {
    // fallback: capture all h1/h2/h3/etc. in case layout changes
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(h => contentCell.appendChild(h));
    if (!contentCell.hasChildNodes()) contentCell = '';
  }

  // ---- Build the block table ----
  const rows = [
    headerRow,
    [imgCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
