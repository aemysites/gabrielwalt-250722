/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Hero (hero6)'];

  // Get background image (row 2)
  // The image is inside the first child div of .grid-layout
  let bgImg = '';
  const gridLayout = element.querySelector('.grid-layout');
  if (gridLayout) {
    const gridChildren = gridLayout.querySelectorAll(':scope > div');
    if (gridChildren[0]) {
      // Look for an <img> inside the first grid child
      const img = gridChildren[0].querySelector('img');
      if (img) bgImg = img;
    }
  }
  const bgImgRow = [bgImg];

  // Get content: heading, subheading, CTA (row 3)
  let contentCell = '';
  // The text content is inside a .card in the second grid child
  if (gridLayout && gridLayout.querySelectorAll(':scope > div')[1]) {
    const grid2 = gridLayout.querySelectorAll(':scope > div')[1];
    // The card is nested within another grid inside this div
    const innerGrid = grid2.querySelector('.grid-layout.desktop-1-column');
    if (innerGrid) {
      const card = innerGrid.querySelector('.card');
      if (card) contentCell = card;
    }
  }
  const contentRow = [contentCell];

  // Compose and replace
  const cells = [headerRow, bgImgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
