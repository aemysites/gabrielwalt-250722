/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first-level grid children in the header (for image/content split)
  const grids = element.querySelectorAll(':scope > .w-layout-grid > div');

  // Get background image (first img within the first grid)
  let bgImg = null;
  for (const grid of grids) {
    const img = grid.querySelector('img');
    if (img) {
      bgImg = img;
      break;
    }
  }

  // Get content (the grid containing the main heading)
  let content = null;
  for (const grid of grids) {
    if (grid.querySelector('h1, h2, h3, h4, h5, h6')) {
      content = grid;
      break;
    }
  }

  // Defensive: handle missing image/content
  const headerRow = ['Hero (hero39)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [content ? content : ''];

  // Construct table as specified: 1 column, 3 rows
  const cells = [headerRow, imageRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
