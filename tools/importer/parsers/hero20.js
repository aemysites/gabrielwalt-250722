/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header: matches example exactly
  const headerRow = ['Hero (hero20)'];

  // 2. Extract background image grid (second row):
  // The visual background is a collage of images, contained in .grid-layout.desktop-3-column
  let backgroundGrid = null;
  const heroScale = element.querySelector('.ix-hero-scale-3x-to-1x');
  if (heroScale) {
    backgroundGrid = heroScale.querySelector('.grid-layout.desktop-3-column');
  }
  // If not found, fallback to first image (shouldn't happen with provided HTML)
  if (!backgroundGrid) {
    const img = element.querySelector('img');
    backgroundGrid = img || null;
  }
  // If still missing, leave cell empty

  // 3. Extract content block (third row): Headline, subheading, CTAs
  // This is inside .ix-hero-scale-3x-to-1x-content > .container
  let contentBlock = null;
  const contentSection = element.querySelector('.ix-hero-scale-3x-to-1x-content');
  if (contentSection) {
    const container = contentSection.querySelector('.container');
    if (container) contentBlock = container;
  }
  // If not found, fallback to first heading
  if (!contentBlock) {
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    contentBlock = heading || null;
  }

  // 4. Compose table: 1 col x 3 rows (header, background, content)
  const cells = [
    headerRow,
    [backgroundGrid],
    [contentBlock],
  ];

  // 5. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
