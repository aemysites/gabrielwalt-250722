/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row
  const headerRow = ['Carousel (carousel21)'];

  // Find the innermost card body containing content
  // Defensive: drill down based on the known structure
  let cardBody = element;
  let firstDiv = element.querySelector(':scope > div');
  if (firstDiv) {
    let cardDiv = firstDiv.querySelector(':scope > div.card.card-on-secondary');
    if (cardDiv) {
      let cardBodyDiv = cardDiv.querySelector(':scope > div.card-body');
      if (cardBodyDiv) {
        cardBody = cardBodyDiv;
      }
    }
  }

  // Get image (mandatory for carousel slide)
  const img = cardBody.querySelector('img');
  // Get title (optional)
  const headingDiv = cardBody.querySelector('.h4-heading');

  // Build text cell, if there is heading text
  let textCell = '';
  if (headingDiv && headingDiv.textContent.trim()) {
    const heading = document.createElement('h4');
    heading.textContent = headingDiv.textContent.trim();
    textCell = heading;
  }

  // Rows: header, then one slide row
  const rows = [];
  // Always 2 columns: image, text
  const slideRow = [img, textCell];
  rows.push(slideRow);

  // Build table array
  const tableArray = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableArray, document);

  // Replace original
  element.replaceWith(block);
}
