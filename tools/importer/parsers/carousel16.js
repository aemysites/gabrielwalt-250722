/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Carousel (carousel16)'];

  // Locate the slide container (the grid of images)
  let grid = element.querySelector('.w-layout-grid');
  if (!grid) grid = element;

  // Extract slide image elements only, each slide is a DIV with an IMG inside
  const slideDivs = Array.from(grid.children).filter(child => child.tagName === 'DIV');

  // Each row: image in first cell, second cell empty (since no text in source HTML)
  const rows = slideDivs.map(div => {
    const img = div.querySelector('img');
    if (!img) return null; // Defensive: skip if no image
    return [img, ''];
  }).filter(Boolean); // Remove any nulls

  // Compose the cells array for the block table
  const cells = [headerRow, ...rows];

  // Create the block table with the images and correct header
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire block element with the block table
  element.replaceWith(table);
}
