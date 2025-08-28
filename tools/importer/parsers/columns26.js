/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Columns (columns26)'];

  // Find the main grid
  const outerGrid = element.querySelector('.container > .w-layout-grid');
  if (!outerGrid) return;

  // Get the main grid's children: [heading, quote, testimonial grid]
  const children = Array.from(outerGrid.children);
  // Find heading and quote
  const heading = children.find(el => el.classList.contains('h2-heading'));
  const quote = children.find(el => el.classList.contains('paragraph-lg'));
  // Find the testimonial grid (the third child)
  const testimonialGrid = children.find(el => el.classList.contains('w-layout-grid'));

  // In the markdown example, left column: heading + quote; right column: testimonial block
  // So we group heading+quote in left, entire testimonial block in right
  let leftCellContent = [];
  if (heading) leftCellContent.push(heading);
  if (quote) leftCellContent.push(quote);

  let rightCellContent = [];
  if (testimonialGrid) rightCellContent.push(testimonialGrid);

  // Structure: header row, then content row with two columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCellContent, rightCellContent]
  ], document);
  element.replaceWith(table);
}
