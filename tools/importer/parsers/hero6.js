/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header, exactly as example
  const headerRow = ['Hero (hero6)'];

  // 2. Background image: find the FIRST img in the block
  let backgroundImg = element.querySelector('img');
  let imageCell = backgroundImg ? backgroundImg : '';

  // 3. Content cell: Collect heading, subheading, and CTA group from the .card
  let contentCell;
  let card = element.querySelector('.card');
  if (card) {
    const fragments = [];
    // Heading: prefer h1, then h2/h3 if missing
    let heading = card.querySelector('h1, h2, h3');
    if (heading) fragments.push(heading);
    // Subheading: first p in card
    let subheading = card.querySelector('p');
    if (subheading) fragments.push(subheading);
    // CTA buttons: .button-group
    let buttonGroup = card.querySelector('.button-group');
    if (buttonGroup) fragments.push(buttonGroup);
    contentCell = fragments;
  } else {
    // If no card, try to get heading/p/buttons from direct children of element
    const fragments = [];
    let heading = element.querySelector('h1, h2, h3');
    if (heading) fragments.push(heading);
    let subheading = element.querySelector('p');
    if (subheading) fragments.push(subheading);
    let buttons = element.querySelector('.button-group');
    if (buttons) fragments.push(buttons);
    contentCell = fragments.length ? fragments : '';
  }

  // 4. Build table structure: 1 column, 3 rows
  const cells = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // 5. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
