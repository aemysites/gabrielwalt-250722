/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Cards (cards7)'];

  // Get all direct child card divs
  const cardDivs = element.querySelectorAll(':scope > div');
  const rows = [headerRow];

  cardDivs.forEach(cardDiv => {
    // Each cardDiv should contain an img
    const img = cardDiv.querySelector('img');
    // Defensive: If no img, skip this card
    if (!img) return;
    // First cell: reference existing img element
    // Second cell: no text content present in provided HTML
    rows.push([img, '']);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
