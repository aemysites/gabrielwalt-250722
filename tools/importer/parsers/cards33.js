/* global WebImporter */
export default function parse(element, { document }) {
  // Define table header
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // Each card is an <a> element directly under the main div
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  cards.forEach(card => {
    // Card content is inside the first child div of the anchor
    const cardContentGrid = card.firstElementChild;
    if (!cardContentGrid) return;

    // Image: always the first child of that grid
    const img = cardContentGrid.querySelector('img');

    // Text content is the first div after the img (direct sibling)
    let textDiv = null;
    const children = Array.from(cardContentGrid.children);
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName !== 'IMG') {
        textDiv = children[i];
        break;
      }
    }

    // Defensive: If either image or text is missing, skip this card
    if (!img || !textDiv) return;

    // Place image in first cell, text content div in second cell
    rows.push([img, textDiv]);
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
