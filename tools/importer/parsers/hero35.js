/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row: exactly as required
  const headerRow = ['Hero (hero35)'];
  // 2. Background image row (none in this HTML)
  const bgRow = [''];
  // 3. Content row (title, subheading, cta)
  // Find the grid that contains all content
  const grid = element.querySelector('.grid-layout');
  let headingSection = null;
  let button = null;
  if (grid) {
    // Identify the child with the heading and subheading
    const children = grid.querySelectorAll(':scope > div, :scope > a');
    for (const child of children) {
      if (!headingSection && child.querySelector('h2, h1')) {
        headingSection = child;
      }
      if (!button && child.matches('a.button, a.w-button')) {
        button = child;
      }
    }
  }
  // Assemble all content, in order, in a wrapper
  const contentElems = [];
  if (headingSection) contentElems.push(headingSection);
  if (button) contentElems.push(button);
  let contentCell;
  if (contentElems.length === 1) {
    contentCell = contentElems[0];
  } else if (contentElems.length > 1) {
    const wrapper = document.createElement('div');
    contentElems.forEach((el) => wrapper.appendChild(el));
    contentCell = wrapper;
  } else {
    // fallback: empty cell
    contentCell = '';
  }

  // Compose the table cells as per the example (1 column, 3 rows)
  const cells = [
    headerRow,
    bgRow,
    [contentCell]
  ];

  // Create the table with the utility function
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
