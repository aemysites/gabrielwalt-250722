/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the block example
  const headerRow = ['Cards'];
  // Find all direct card containers (each card is a flex-horizontal div)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [headerRow];
  cardDivs.forEach(cardDiv => {
    // Each cardDiv contains: optionally an icon and a <p> element with the card's text
    // Per spec, only text content is mandatory. No headings or CTA links appear in the HTML.
    const p = cardDiv.querySelector('p');
    if (p && p.textContent.trim()) {
      // Reference the existing <p> element directly for semantic meaning
      rows.push([p]);
    }
    // If no <p> present, skip this card (should not happen with provided HTML)
  });
  // Only create the table if there is at least one card row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
