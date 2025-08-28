/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as per the example
  const headerRow = ['Cards'];
  const rows = [];

  // Each card is a direct child div
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach((card) => {
    // The card's meaningful content is in the <p> tag
    const desc = card.querySelector('p');
    if (desc) {
      rows.push([desc]);
    } else {
      // If a card somehow doesn't have a <p>, skip it (permissive for edge cases)
    }
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
