/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing carousel slides
  const grid = element.querySelector('.w-layout-grid');
  if (!grid) return;
  const slides = Array.from(grid.children);

  // Block header row must match target block name exactly
  const headerRow = ['Carousel (carousel16)'];
  const rows = [headerRow];

  // Each slide: image in first cell, second cell is always present (empty if no text)
  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (img) {
      rows.push([img, '']); // Always two columns per row
    }
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
