/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in example
  const headerRow = ['Cards (cards10)'];
  const cells = [headerRow];

  // Get all immediate <a> children (each is a card)
  const cards = Array.from(element.querySelectorAll(':scope > a'));
  cards.forEach(card => {
    // Find image (always inside first <div> of card)
    const divs = card.querySelectorAll(':scope > div');
    let img = '';
    if (divs.length > 0) {
      const foundImg = divs[0].querySelector('img');
      if (foundImg) img = foundImg;
    }

    // Find text content (second <div> of card)
    let textCellContent = [];
    if (divs.length > 1) {
      const textDiv = divs[1];
      // Tag (if exists)
      const tagGroup = textDiv.querySelector('.tag-group');
      if (tagGroup) textCellContent.push(tagGroup);
      // Heading (h3 or .h4-heading)
      const heading = textDiv.querySelector('h3, .h4-heading');
      if (heading) textCellContent.push(heading);
      // Paragraph
      const paragraph = textDiv.querySelector('p');
      if (paragraph) textCellContent.push(paragraph);
    }
    if (!img && textCellContent.length === 0) {
      // If both missing, skip this card
      return;
    }
    // Add card row
    cells.push([
      img || '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
