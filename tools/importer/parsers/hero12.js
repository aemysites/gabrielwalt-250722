/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Hero (hero12)'];

  // Find background image: first absolutely positioned .cover-image in the left grid cell
  let bgImage = null;
  const gridCols = element.querySelectorAll(':scope > .w-layout-grid > div');
  if (gridCols.length > 0) {
    // Look for an img.cover-image inside the first col
    bgImage = gridCols[0].querySelector('img.cover-image');
  }

  // Foreground content: second grid cell (text content, image, cta)
  let contentCell = null;
  if (gridCols.length > 1) {
    // This col has the .container > .card > .card-body > .grid-layout
    const cardGrid = gridCols[1].querySelector('.card-body .grid-layout');
    if (cardGrid) {
      // Per instructions: reference all direct children of cardGrid in a single cell
      contentCell = Array.from(cardGrid.children);
    } else {
      // Fallback: reference the whole .container cell
      contentCell = [gridCols[1]];
    }
  } else {
    // Fallback: if content missing, use null
    contentCell = [''];
  }

  // Structure matches: header, background image (row 2), foreground content (row 3)
  const rows = [
    headerRow,
    [bgImage ? bgImage : ''],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
