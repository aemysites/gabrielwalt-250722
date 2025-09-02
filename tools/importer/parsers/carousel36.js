/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Block header row
  const headerRow = ['Carousel (carousel36)'];
  const rows = [headerRow];

  // Locate the main grid containing text and images
  const grid = element.querySelector('.w-layout-grid.grid-layout.tablet-1-column');
  if (!grid) return;
  const gridChildren = grid.querySelectorAll(':scope > div');
  if (gridChildren.length < 2) return;
  const textCol = gridChildren[0];
  const imagesCol = gridChildren[1];

  // Compose the text content cell (as a fragment, preserving structure)
  const textFragment = document.createDocumentFragment();
  // Instead of only h1, p, and .button-group, include ALL content from textCol
  Array.from(textCol.childNodes).forEach(node => {
    textFragment.appendChild(node.cloneNode(true));
  });

  // Find all images in the image grid
  const imageGrid = imagesCol.querySelector('.w-layout-grid');
  if (!imageGrid) return;
  const imgs = imageGrid.querySelectorAll('img');

  imgs.forEach(img => {
    if (!img || !img.src) return;
    // Reference the existing image element (do not clone)
    rows.push([img, textFragment.cloneNode(true)]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
