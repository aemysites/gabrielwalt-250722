/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, per example and instructions
  const headerRow = ['Cards (cards17)'];

  // Get all immediate children: each card image wrapper
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each card: extract the image, put in first cell, leave second cell empty (no text found)
  const rows = cardDivs.map(cardDiv => {
    const img = cardDiv.querySelector('img');
    // Defensive: if there's no image, leave cell empty
    return [img ? img : '', ''];
  });

  // Build table rows: header then each card row
  const cells = [headerRow, ...rows];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
