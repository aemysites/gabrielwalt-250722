/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: block name exactly as in example
  const headerRow = ['Hero (hero20)'];

  // 2. Background images (all <img> from the image grid)
  // Find the .grid-layout.desktop-3-column grid inside the header for images
  let imagesContainer = element.querySelector('.grid-layout.desktop-3-column');
  let imageElements = [];
  if (imagesContainer) {
    imageElements = Array.from(imagesContainer.querySelectorAll('img'));
  }
  // Always place images as an array in a single cell
  const backgroundRow = [imageElements];

  // 3. Text content: heading, subheading, CTAs (all in one cell)
  // Locate container with text and CTAs
  let contentContainer = element.querySelector('.ix-hero-scale-3x-to-1x-content');
  // Fallback: find .container.utility-text-on-overlay (for variations)
  if (!contentContainer) {
    contentContainer = element.querySelector('.container.utility-text-on-overlay');
  }
  let contentCellItems = [];
  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('h1');
    if (heading) contentCellItems.push(heading);
    // Subheading (paragraph)
    const subheading = contentContainer.querySelector('p');
    if (subheading) contentCellItems.push(subheading);
    // CTAs (all <a> links in button group)
    const buttonGroup = contentContainer.querySelector('.button-group');
    if (buttonGroup) {
      const ctas = Array.from(buttonGroup.querySelectorAll('a'));
      if (ctas.length) contentCellItems.push(...ctas);
    }
  }
  // Defensive: if nothing found, add an empty paragraph
  if (contentCellItems.length === 0) {
    const emptyParagraph = document.createElement('p');
    contentCellItems.push(emptyParagraph);
  }
  const contentRow = [contentCellItems];

  // 4. Build block table
  const cells = [headerRow, backgroundRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
