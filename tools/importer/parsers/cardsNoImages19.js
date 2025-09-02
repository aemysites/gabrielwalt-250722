/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists
  if (!element) return;

  // Table header row as required
  const headerRow = ['Cards (cardsNoImages19)'];
  const rows = [headerRow];

  // Get all immediate children (each card is a direct child div)
  const cardDivs = element.querySelectorAll(':scope > div');

  cardDivs.forEach((cardDiv) => {
    // Each cardDiv contains: icon (svg) and paragraph (description)
    // We'll include both in the cell, preserving the icon and text
    const iconWrapper = cardDiv.querySelector(':scope > div .icon');
    const description = cardDiv.querySelector(':scope > p');

    // Defensive: skip if no description
    if (!description) return;

    // Compose cell content: icon (if present) + description
    const cellContent = [];
    if (iconWrapper) cellContent.push(iconWrapper);
    cellContent.push(description);

    rows.push([cellContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
