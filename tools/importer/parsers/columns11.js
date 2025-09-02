/* global WebImporter */
export default function parse(element, { document }) {
  // Find main container blocks
  const containers = element.querySelectorAll(':scope > div');
  if (containers.length < 2) return;

  // Left: headline and eyebrow
  const leftCol = containers[0];
  const leftContent = [];
  // Collect all text content from leftCol
  leftCol.querySelectorAll(':scope > *').forEach((node) => {
    leftContent.push(node.cloneNode(true));
  });

  // Right: intro, author, button
  const rightCol = containers[1];
  const rightContent = [];
  // Collect all text content from rightCol (including intro, author, button)
  rightCol.querySelectorAll(':scope > *').forEach((node) => {
    rightContent.push(node.cloneNode(true));
  });

  // Images from lower grid
  const imageGrid = element.querySelector('.w-layout-grid.grid-layout.mobile-portrait-1-column');
  let imgCells = [];
  if (imageGrid) {
    const imgDivs = imageGrid.querySelectorAll('.utility-aspect-1x1');
    imgCells = Array.from(imgDivs).map(div => {
      const img = div.querySelector('img');
      return img ? img.cloneNode(true) : '';
    });
  }

  // Always use two columns for the Columns block
  const contentRow = [leftContent, rightContent];

  // Ensure image row has two columns
  let imageRow;
  if (imgCells.length > 0) {
    imageRow = imgCells.slice(0, 2);
    while (imageRow.length < 2) imageRow.push('');
  }

  const cells = [
    ['Columns (columns11)'],
    contentRow,
  ];
  if (imageRow) cells.push(imageRow);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
