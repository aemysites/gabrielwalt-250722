/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row must match block name exactly
  const headerRow = ['Table (bordered, tableBordered13)'];

  // Find all .divider children (each is a Q&A row)
  const dividerDivs = Array.from(element.querySelectorAll(':scope > .divider'));

  // Defensive fallback: if no .divider children, try grid-layout blocks
  const rows = dividerDivs.length > 0 ? dividerDivs : Array.from(element.querySelectorAll(':scope > .w-layout-grid'));

  // Build table rows
  const tableRows = rows.map(divider => {
    // Each divider contains a grid-layout with two children: question and answer
    const grid = divider.querySelector('.w-layout-grid');
    if (!grid) return [];
    const children = Array.from(grid.children);
    // Defensive: Expecting two children per row
    const question = children[0] || document.createElement('div');
    const answer = children[1] || document.createElement('div');
    // Reference existing elements, do not clone
    return [question, answer];
  }).filter(row => row.length === 2);

  // Compose cells array
  const cells = [headerRow, ...tableRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
