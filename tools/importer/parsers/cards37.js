/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the table
  const headerRow = ['Cards (cards37)'];
  // Find the main cards grid (the first .w-layout-grid under the section)
  let grid = element.querySelector('.w-layout-grid');
  // Defensive: if not found, look deeper
  if (!grid) {
    grid = element.querySelector('[class*="grid"]');
  }
  // Collect all card anchors in the main grid and all subgrids (nested cards)
  // Cards can be direct children (<a>) or inside a nested grid (<div> <a> ...)
  let cardLinks = Array.from(grid.querySelectorAll(':scope > a'));
  // Also check for any nested grids containing cards
  const nestedGrids = Array.from(grid.querySelectorAll(':scope > .w-layout-grid'));
  nestedGrids.forEach(subgrid => {
    const nestedLinks = Array.from(subgrid.querySelectorAll(':scope > a'));
    cardLinks = cardLinks.concat(nestedLinks);
  });
  // Defensive: remove duplicates (if any)
  cardLinks = cardLinks.filter((v, i, arr) => arr.indexOf(v) === i);

  const rows = [headerRow];

  cardLinks.forEach(card => {
    // The image is inside a .utility-aspect-2x3 or .utility-aspect-1x1 div, which contains an <img>
    const imgDiv = card.querySelector('.utility-aspect-2x3, .utility-aspect-1x1');
    const img = imgDiv ? imgDiv.querySelector('img') : null;

    // For the text cell: grab heading (h3), description (p), and CTA (.button) if present
    const textBlock = [];
    // Heading: h2-heading or h4-heading
    const heading = card.querySelector('h2, h3, h4, h5, h6');
    if (heading) textBlock.push(heading);
    // Description
    const desc = card.querySelector('p');
    if (desc) textBlock.push(desc);
    // CTA button or link
    const cta = card.querySelector('.button, button, a.button');
    if (cta) textBlock.push(cta);

    rows.push([img, textBlock]);
  });

  // Only create the block if we actually found cards
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
