/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, as required
  const headerRow = ['Columns (columns11)'];

  // Get top grid with two columns: left (headline) and right (subheadline + author etc)
  const topGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  let leftCol = null, rightCol = null;
  if (topGrid) {
    const topGridChildren = Array.from(topGrid.children);
    leftCol = topGridChildren[0];
    rightCol = topGridChildren[1];
  }

  // Left column: headline and eyebrow
  let leftCellContent = [];
  if (leftCol) {
    // Only include if present
    leftCellContent.push(leftCol);
  }

  // Right column: paragraph, author, CTA
  let rightCellContent = [];
  if (rightCol) {
    rightCellContent.push(rightCol);
  }

  // Get bottom grid with two images
  const bottomGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  let img0 = '', img1 = '';
  if (bottomGrid) {
    const bottomDivs = Array.from(bottomGrid.children);
    if (bottomDivs[0]) {
      const imgA = bottomDivs[0].querySelector('img');
      if (imgA) img0 = imgA;
    }
    if (bottomDivs[1]) {
      const imgB = bottomDivs[1].querySelector('img');
      if (imgB) img1 = imgB;
    }
  }

  // Compose block table
  const cells = [
    headerRow,
    [leftCellContent, rightCellContent],
    [img0, img1]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
