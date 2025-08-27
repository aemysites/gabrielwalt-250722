/* global WebImporter */
export default function parse(element, { document }) {
  // Strictly follow the example: Only one table, first row is header 'Columns (columns26)', second row has the full block in each column.
  // Find the main grid layout in the section
  const container = element.querySelector('.container');
  if (!container) return;

  // Find all direct child grid layouts (there may be nesting)
  // The main grid that contains columns is likely the most deeply nested one
  let mainGrid = null;
  // Find the grid that contains the author and brand/divider
  let innerGrid = null;
  const grids = container.querySelectorAll('.grid-layout');
  if (grids.length === 2) {
    // If two, outer is grids[0], inner is grids[1]
    mainGrid = grids[0];
    innerGrid = grids[1];
  } else if (grids.length === 1) {
    mainGrid = grids[0];
    innerGrid = grids[0].querySelector('.grid-layout');
  } else {
    mainGrid = container;
    innerGrid = container.querySelector('.grid-layout');
  }

  // Get heading and quote
  const heading = container.querySelector('.h2-heading');
  const quote = container.querySelector('.paragraph-lg');

  // The innerGrid contains: divider, author, brand
  let divider = null;
  let author = null;
  let brand = null;
  if (innerGrid) {
    const children = innerGrid.querySelectorAll(':scope > div');
    divider = Array.from(children).find(div => div.classList.contains('divider'));
    author = Array.from(children).find(div => div.classList.contains('flex-horizontal'));
    brand = Array.from(children).find(div => div.classList.contains('utility-display-inline-block'));
    // If brand is not a DIV but a SVG (brand may just be an SVG, not wrapped)
    if (!brand) {
      brand = innerGrid.querySelector('svg');
    }
  }

  // Build left cell: heading, divider, author
  const leftCol = document.createElement('div');
  if (heading) leftCol.appendChild(heading);
  if (divider) leftCol.appendChild(divider);
  if (author) leftCol.appendChild(author);

  // Build right cell: quote, brand
  const rightCol = document.createElement('div');
  if (quote) rightCol.appendChild(quote);
  if (brand) rightCol.appendChild(brand);

  // Only use elements as extracted, do not clone or re-create content

  // Table header row exactly as required
  const headerRow = ['Columns (columns26)'];
  // Table content row: one cell for each block column
  const contentRow = [leftCol, rightCol];

  // Compose and replace
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
