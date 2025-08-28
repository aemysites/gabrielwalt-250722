/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: must match example
  const headerRow = ['Hero (hero35)'];

  // Second row: Background image (none in this HTML, cell should be empty)
  const backgroundRow = [''];

  // Third row: Content (title, subheading, CTA)
  // Locate inner content structure
  let headline, subheading, cta;
  const gridLayout = element.querySelector('.grid-layout');
  if (gridLayout) {
    // Get top-level children of grid
    const children = Array.from(gridLayout.children);
    children.forEach((child) => {
      if (child.tagName === 'DIV') {
        // Usually contains headline and subheading
        if (!headline) headline = child.querySelector('h2');
        if (!subheading) subheading = child.querySelector('p');
      } else if (child.tagName === 'A') {
        // CTA button/link
        if (!cta) cta = child;
      }
    });
  }
  const contentElements = [];
  if (headline) contentElements.push(headline);
  if (subheading) contentElements.push(subheading);
  if (cta) contentElements.push(cta);

  // Always build the correct number of rows/columns
  const cells = [headerRow, backgroundRow, [contentElements]];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
