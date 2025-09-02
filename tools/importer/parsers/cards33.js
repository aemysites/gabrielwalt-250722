/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image and text content from each card anchor
  function extractCardContent(cardAnchor) {
    // Find the image (mandatory)
    const img = cardAnchor.querySelector('img');

    // Find the text content container (the div after the image)
    const gridDivs = cardAnchor.querySelectorAll(':scope > div');
    let textContentDiv = null;
    if (gridDivs.length > 0) {
      // Usually the first div after the image
      textContentDiv = gridDivs[0];
    }

    // Defensive: fallback to the cardAnchor if structure changes
    if (!textContentDiv) textContentDiv = cardAnchor;

    // We'll collect the text content (title, description, tags, etc.)
    // as a single fragment for the right cell
    const textFragment = document.createDocumentFragment();
    // Copy all children except the image
    Array.from(textContentDiv.children).forEach((child) => {
      textFragment.appendChild(child);
    });

    return [img, textFragment];
  }

  // Get all card anchors (each card is an <a> with class 'utility-link-content-block')
  const cardAnchors = element.querySelectorAll(':scope > a.utility-link-content-block');

  // Build the table rows
  const rows = [];
  // Header row as per block guidelines
  rows.push(['Cards (cards33)']);

  // Each card: [image, text content]
  cardAnchors.forEach((cardAnchor) => {
    const [img, textContent] = extractCardContent(cardAnchor);
    rows.push([img, textContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
