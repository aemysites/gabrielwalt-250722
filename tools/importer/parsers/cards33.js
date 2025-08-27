/* global WebImporter */
export default function parse(element, { document }) {
  // Header exactly as in the example
  const headerRow = ['Cards (cards33)'];

  // Get all direct <a> elements (cards)
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  const rows = cards.map(card => {
    // First cell: image element
    const img = card.querySelector('img');

    // Second cell: text content (keep headings, description, tags, read-time, CTA)
    // We'll reference the content container inside the card (the first nested div after the img)
    let textContainer = null;
    const possibleContainers = card.querySelectorAll('div');
    for (const div of possibleContainers) {
      if (div.querySelector('h3, .h4-heading')) {
        textContainer = div;
        break;
      }
    }
    // Fallback: if not found, use the first div after img
    if (!textContainer) {
      const imgIndex = Array.from(card.children).indexOf(img);
      textContainer = card.children[imgIndex+1] || card;
    }

    // Reference the existing textContainer only (do not clone)
    return [img, textContainer];
  });
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
