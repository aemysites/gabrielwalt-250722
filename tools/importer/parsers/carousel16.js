/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row exactly as in example
  const headerRow = ['Carousel (carousel16)'];

  // Find the grid container in the section
  const grid = element.querySelector('.grid-layout');
  if (!grid) return; // Edge case: no grid found, do nothing

  // Each grid child div is a slide
  const slides = Array.from(grid.children);

  // Extract each slide: only image present, no text
  const rows = slides.map(slide => {
    // Find the first <img> inside the slide
    const img = slide.querySelector('img');
    // Edge case: skip slide if no image
    if (!img) return null;
    // First cell: image element (referenced)
    // Second cell: empty string (no text content in this source)
    return [img, ''];
  }).filter(Boolean);

  // Table: header row + one row per slide
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
