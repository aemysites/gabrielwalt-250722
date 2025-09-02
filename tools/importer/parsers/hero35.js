/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content container
  const container = element.querySelector('.container');
  if (!container) return;

  // Get the grid layout div (holds content)
  const grid = container.querySelector('.w-layout-grid');
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // Find the content block (headings/subheading)
  let contentBlock = null;
  let ctaBlock = null;
  gridChildren.forEach(child => {
    if (child.querySelector('h2')) {
      contentBlock = child;
    } else if (child.tagName === 'A') {
      ctaBlock = child;
    }
  });

  // Defensive: if contentBlock is missing, abort
  if (!contentBlock) return;

  // Extract heading
  const heading = contentBlock.querySelector('h2');
  // Extract subheading (optional)
  const subheading = contentBlock.querySelector('p');

  // Compose content cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (ctaBlock) contentCell.push(ctaBlock);

  // Table rows
  const headerRow = ['Hero (hero35)'];
  const imageRow = ['']; // No image in this block
  const contentRow = [contentCell];

  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
