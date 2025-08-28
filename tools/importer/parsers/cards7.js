/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in the example
  const headerRow = ['Cards (cards7)'];
  const cells = [headerRow];

  // Each card is a direct child div
  const cardDivs = element.querySelectorAll(':scope > div');
  cardDivs.forEach(card => {
    // Find the image inside the card
    const img = card.querySelector('img');

    // For text content: collect all non-image children (for generality)
    // If there's only an image, textContent will be empty string
    let textContent = '';
    // Collect all direct children except images
    const contentNodes = Array.from(card.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node.tagName.toLowerCase() !== 'img';
      }
      // Allow text nodes
      return node.nodeType === Node.TEXT_NODE;
    });
    // Compose text content
    if (contentNodes.length > 0) {
      // Create a container div to hold all text and non-image element nodes
      const textContainer = document.createElement('div');
      contentNodes.forEach(node => textContainer.appendChild(node.cloneNode(true)));
      cells.push([img, textContainer]);
    } else {
      // No text content
      cells.push([img, '']);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}