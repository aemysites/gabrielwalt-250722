/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match exactly
  const headerRow = ['Hero (hero39)'];

  // Background image: find main img
  let bgImg = null;
  // Look for an img with class 'cover-image' (common for hero bg)
  const possibleImgs = element.querySelectorAll('img');
  for (const img of possibleImgs) {
    // Only pick first visible/hero image, usually with 'cover' in class or style
    if (img.className && img.className.match(/cover|background|hero/i)) {
      bgImg = img;
      break;
    }
  }
  // Fallback: just first <img> if no special class
  if (!bgImg && possibleImgs.length > 0) {
    bgImg = possibleImgs[0];
  }

  // Content cell: headline, paragraph, CTA
  // The main text content is usually in the right-side grid cell
  // Find the h1
  const h1 = element.querySelector('h1');
  // Find all paragraphs that are visible and not inside button group
  let paragraphs = [];
  if (h1) {
    // Try to get paragraphs in the same grid cell (column) as h1
    const h1Col = h1.closest('div');
    if (h1Col) {
      paragraphs = Array.from(h1Col.querySelectorAll('p'));
    }
  }
  // Fallback: any paragraph in the header
  if (!paragraphs.length) {
    paragraphs = Array.from(element.querySelectorAll('p'));
  }

  // Find CTA: a.button or with 'button' in class
  let cta = null;
  const ctaBtn = element.querySelector('a.button, a[class*="button"]');
  if (ctaBtn) cta = ctaBtn;

  // Compose the content cell
  const contentCell = [];
  if (h1) contentCell.push(h1);
  if (paragraphs.length) contentCell.push(...paragraphs);
  if (cta) contentCell.push(cta);

  // Create table structure: 1 col, 3 rows
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
