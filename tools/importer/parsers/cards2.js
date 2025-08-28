/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card links (block items) in source order
  function getCards() {
    const gridContainer = element.querySelector('.grid-layout');
    if (!gridContainer) return [];
    const cardLinks = [];
    // First card: direct child a.utility-link-content-block (large card)
    const firstCard = gridContainer.querySelector(':scope > a.utility-link-content-block');
    if (firstCard) cardLinks.push(firstCard);
    // Next cards: in the first flex-horizontal
    const flexGroups = gridContainer.querySelectorAll(':scope > .flex-horizontal');
    if (flexGroups.length > 0) {
      const firstFlex = flexGroups[0];
      if (firstFlex) {
        firstFlex.querySelectorAll(':scope > a.utility-link-content-block').forEach(card => cardLinks.push(card));
      }
      // The second flex-horizontal contains text-only cards, separated by dividers
      if (flexGroups.length > 1) {
        const secondFlex = flexGroups[1];
        if (secondFlex) {
          secondFlex.querySelectorAll(':scope > a.utility-link-content-block').forEach(card => cardLinks.push(card));
        }
      }
    }
    return cardLinks;
  }

  // Table header matches the example
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  const cards = getCards();
  cards.forEach(card => {
    // Image, if present, goes in column 1
    let imageCell = '';
    const img = card.querySelector('img');
    if (img) imageCell = img;
    // Text area: preserve tag, heading, description (in order)
    const cellContent = [];
    // Tag group (optional)
    const tagGroup = card.querySelector('.tag-group');
    if (tagGroup) cellContent.push(tagGroup);
    // Heading (h3)
    const heading = card.querySelector('h3');
    if (heading) cellContent.push(heading);
    // Paragraph (description)
    const para = card.querySelector('p');
    if (para) cellContent.push(para);
    // If nothing is present, ensure cell is empty string
    rows.push([imageCell, cellContent.length > 0 ? cellContent : '']);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
