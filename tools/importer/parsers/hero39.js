/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Hero (hero39)'];

  // --- Row 2: Background Image ---
  // Find the background image (img.cover-image)
  const bgImg = element.querySelector('img.cover-image');
  // Defensive: Only include if present
  const imageRow = [bgImg ? bgImg : ''];

  // --- Row 3: Content (heading, paragraph, button) ---
  // Find the container with the text and CTA
  // The structure is: header > div.grid-layout > div.container > div.grid-layout > ...
  // We'll grab the inner grid-layout (contains h1 and content)
  let contentCell = '';
  const gridContainers = element.querySelectorAll('.container');
  if (gridContainers.length > 0) {
    // The first .container is the content block
    const contentGrid = gridContainers[0].querySelector('.grid-layout');
    if (contentGrid) {
      contentCell = contentGrid;
    }
  }
  const contentRow = [contentCell];

  // --- Assemble table ---
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
