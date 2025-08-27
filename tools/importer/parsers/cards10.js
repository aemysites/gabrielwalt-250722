/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards10) block table header
  const headerRow = ['Cards (cards10)'];
  const cells = [headerRow];

  // Find all card elements (direct children links)
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));

  cardLinks.forEach((card) => {
    // First cell: image (mandatory)
    let imgEl = null;
    const aspectDiv = card.querySelector('div[class*="utility-aspect-3x2"]');
    if (aspectDiv) {
      imgEl = aspectDiv.querySelector('img');
    }

    // Second cell: text content
    const textDiv = card.querySelector('.utility-padding-all-1rem');
    const cellContent = [];
    if (textDiv) {
      // Add tag (optional)
      const tagGroup = textDiv.querySelector('.tag-group');
      if (tagGroup) {
        const tag = tagGroup.querySelector('.tag');
        if (tag) cellContent.push(tag);
      }
      // Add heading (optional)
      const heading = textDiv.querySelector('h3');
      if (heading) cellContent.push(heading);
      // Add paragraph (optional)
      const para = textDiv.querySelector('p');
      if (para) cellContent.push(para);
    }

    cells.push([
      imgEl ? imgEl : '',
      cellContent.length ? cellContent : ''
    ]);
  });

  // Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
