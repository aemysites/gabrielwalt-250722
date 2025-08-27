/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Hero (hero28)'];

  // Row 2: background image
  // Find the main img element (background)
  let img = element.querySelector('img');
  const imgRow = [img ? img : ''];

  // Row 3: content (title, subheading, CTA)
  let contentElements = [];
  // Find the area containing heading/content
  // The second grid cell (usually text area)
  const gridCells = element.querySelectorAll(':scope > .w-layout-grid > div');
  let textCell = null;
  if (gridCells.length > 1) {
    textCell = gridCells[1];
  }
  if (textCell) {
    // Get all child elements in the `.utility-margin-bottom-6rem`
    const contentBlock = textCell.querySelector('.utility-margin-bottom-6rem');
    if (contentBlock) {
      // Add heading (h1)
      const h1 = contentBlock.querySelector('h1');
      if (h1) contentElements.push(h1);
      // Add other heading levels if present
      const h2s = contentBlock.querySelectorAll('h2, h3, h4');
      h2s.forEach(h => contentElements.push(h));
      // Add paragraphs if present
      const ps = contentBlock.querySelectorAll('p');
      ps.forEach(p => contentElements.push(p));
      // Add button group if it has children
      const buttonGroup = contentBlock.querySelector('.button-group');
      if (buttonGroup && buttonGroup.children.length > 0) {
        contentElements.push(buttonGroup);
      }
    }
  }
  // If nothing was found, place a blank string
  const contentRow = [contentElements.length ? contentElements : ''];

  // Compose and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imgRow,
    contentRow
  ], document);
  element.replaceWith(table);
}
