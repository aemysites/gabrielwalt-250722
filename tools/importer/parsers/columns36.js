/* global WebImporter */
export default function parse(element, { document }) {
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;
  const columns = Array.from(grid.children);
  let leftContent = [];
  if (columns[0]) {
    const heading = columns[0].querySelector('h1');
    if (heading) leftContent.push(heading);
    const subheading = columns[0].querySelector('p');
    if (subheading) leftContent.push(subheading);
    const buttonGroup = columns[0].querySelector('.button-group');
    if (buttonGroup) leftContent.push(buttonGroup);
  }
  let rightContent = [];
  if (columns[1]) {
    const innerGrid = columns[1].querySelector('.grid-layout');
    if (innerGrid) {
      const imgs = Array.from(innerGrid.querySelectorAll('img'));
      if (imgs.length) rightContent = imgs;
    }
  }
  // Header row must match number of columns in content row
  const cells = [
    ['Columns (columns36)', ''], // two cells in header row
    [leftContent, rightContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
