/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row
  const headerRow = ['Hero (hero5)'];

  // Find outer grid
  const outerGrid = element.querySelector('.grid-layout');

  // Find image (background/decorative)
  let img = null;
  if (outerGrid) {
    img = outerGrid.querySelector('img');
  } else {
    img = element.querySelector('img');
  }

  // Find the text block containing heading, paragraph, CTA
  let textBlock = null;
  if (outerGrid) {
    // The text block is usually the first div inside the nested grid
    const nestedGrids = outerGrid.querySelectorAll(':scope > div');
    for (const child of nestedGrids) {
      if (child.querySelector('h1, h2, h3, .h2-heading')) {
        textBlock = child;
        break;
      }
    }
  } else {
    // Fallback: first div with heading
    const divs = element.querySelectorAll('div');
    for (const div of divs) {
      if (div.querySelector('h1, h2, h3, .h2-heading')) {
        textBlock = div;
        break;
      }
    }
  }

  // 2nd row: image, only if present
  const imageRow = [img].filter(Boolean);
  // 3rd row: text block, only if present
  const textRow = [textBlock].filter(Boolean);

  // Compose table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
