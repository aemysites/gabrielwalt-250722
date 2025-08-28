/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid layout containing the columns
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  // Get direct children of the grid layout (columns)
  const gridChildren = Array.from(grid.children);

  // Expect 2 columns: left (img), right (content)
  const imgCol = gridChildren.find((child) => child.tagName === 'IMG');
  const contentCol = gridChildren.find((child) => child !== imgCol);

  // Prepare the header row (must match example exactly)
  const headerRow = ['Columns (columns1)'];

  // Prepare the second row: [leftCol, rightCol]
  // Left Column: image as-is (reference existing element)
  // Right Column: group heading, subheading, and button group in an array
  let rightColContent = [];
  if (contentCol) {
    const heading = contentCol.querySelector('h1');
    if (heading) rightColContent.push(heading);
    const subheading = contentCol.querySelector('p');
    if (subheading) rightColContent.push(subheading);
    const buttonGroup = contentCol.querySelector('.button-group');
    if (buttonGroup) rightColContent.push(buttonGroup);
  }

  // Assemble table cells
  const cells = [
    headerRow,
    [imgCol, rightColContent]
  ];

  // Create table block and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
