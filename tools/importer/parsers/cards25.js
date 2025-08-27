/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const headerRow = ['Cards (cards25)'];

  // Get all direct card containers (divs under grid)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  const rows = [headerRow];

  cardDivs.forEach(card => {
    // Image: first <img> in the card div (should always be present per spec)
    const img = card.querySelector('img');

    // Text content: look for .utility-padding-all-2rem or .utility-position-relative for text box
    // If not found, check for heading/para anywhere inside
    let textCellElems = [];
    let contentBox = card.querySelector('.utility-padding-all-2rem') || card.querySelector('.utility-position-relative');
    if (contentBox) {
      // Prefer heading (h3) and paragraph (p)
      const h3 = contentBox.querySelector('h3');
      const p = contentBox.querySelector('p');
      if (h3) textCellElems.push(h3);
      if (p) textCellElems.push(p);
    }
    // If not found, try direct h3/p under card
    if (textCellElems.length === 0) {
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (h3) textCellElems.push(h3);
      if (p) textCellElems.push(p);
    }
    // If still not found, leave cell empty
    let textCell = '';
    if (textCellElems.length === 1) textCell = textCellElems[0];
    else if (textCellElems.length > 1) textCell = textCellElems;

    // Only push a row if there is an <img> (per block definition)
    if (img) {
      rows.push([img, textCell]);
    }
  });
  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
