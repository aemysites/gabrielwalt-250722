/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main layout grids
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  const imageGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  if (!mainGrid) return;

  // Get content columns
  const leftCol = mainGrid.children[0];
  const rightCol = mainGrid.children[1];

  // Get images for the second row
  let img1 = '';
  let img2 = '';
  if (imageGrid) {
    const imageDivs = imageGrid.querySelectorAll('.utility-aspect-1x1');
    if (imageDivs[0]) {
      const imgEl1 = imageDivs[0].querySelector('img');
      if (imgEl1) img1 = imgEl1;
    }
    if (imageDivs[1]) {
      const imgEl2 = imageDivs[1].querySelector('img');
      if (imgEl2) img2 = imgEl2;
    }
  }

  // Table structure fix: header row must be a single cell
  const headerRow = ['Columns (columns11)'];
  const firstRow = [leftCol, rightCol];
  const secondRow = [img1, img2];
  const cells = [headerRow, firstRow, secondRow];

  // Fix: Use createTable and then merge header cells using colspan if needed
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix header row so it is one cell spanning all columns
  const theadTr = table.querySelector('tr');
  if (theadTr && firstRow.length > 1) {
    // Remove any extra ths if present
    while (theadTr.children.length > 1) {
      theadTr.removeChild(theadTr.lastChild);
    }
    theadTr.firstElementChild.setAttribute('colspan', firstRow.length);
  }

  element.replaceWith(table);
}
