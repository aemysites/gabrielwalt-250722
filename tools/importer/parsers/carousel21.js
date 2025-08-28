/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, matches the example exactly
  const headerRow = ['Carousel (carousel21)'];

  // Only one slide structure is present. Find .card-body inside the block
  const cardBody = element.querySelector('.card-body');
  let slideRows = [];
  if (cardBody) {
    // Find image: must be in first cell
    const img = cardBody.querySelector('img');
    // Find heading: optional, can go in second cell
    const h4 = cardBody.querySelector('.h4-heading');
    // Compose the content cell
    let contentCell = '';
    if (h4 && h4.textContent && h4.textContent.trim()) {
      // Use an h2 for proper semantic meaning, referencing original element's text
      const heading = document.createElement('h2');
      heading.textContent = h4.textContent.trim();
      contentCell = heading;
    }
    // For a valid slide, need at least an image
    if (img) {
      slideRows.push([img, contentCell]);
    }
  }

  // Compose the table: header row, then one row per slide
  const tableRows = [headerRow, ...slideRows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(block);
}
