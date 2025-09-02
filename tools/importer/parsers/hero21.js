/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card-body container
  let cardBody = element.querySelector('.card-body');
  if (!cardBody) cardBody = element;

  // Find the image (background/decorative)
  const img = cardBody.querySelector('img');

  // Gather all possible text content for the third row
  const contentCell = [];
  // Title (Heading)
  const heading = cardBody.querySelector('.h4-heading');
  if (heading) contentCell.push(heading);
  // Subheading (optional)
  const subheading = cardBody.querySelector('h2, .subheading, .subtitle');
  if (subheading && subheading !== heading) contentCell.push(subheading);
  // Call-to-Action (optional, look for links/buttons)
  const cta = cardBody.querySelector('a, button');
  if (cta) contentCell.push(cta);

  // Table rows
  const headerRow = ['Hero (hero21)'];
  const imageRow = [img ? img : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
