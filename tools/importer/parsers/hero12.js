/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row
  const headerRow = ['Hero (hero12)'];

  // --- Row 2: Background image ---
  // Look for the main background image (should be the full-width "cover-image", but not the square 1x1 image inside the card)
  let bgImg = null;
  // Find all img.cover-image elements in the section
  const allImages = element.querySelectorAll('img.cover-image');
  for (const img of allImages) {
    // The background image will NOT be inside a .card
    if (!img.closest('.card')) {
      bgImg = img;
      break;
    }
  }
  // if not found, fallback to first image in the section (defensive)
  if (!bgImg && allImages.length) {
    bgImg = allImages[0];
  }

  // --- Row 3: Content: headline, subheading, cta ---
  // Find the .card-body block which contains content (headline, list, cta)
  const cardBody = element.querySelector('.card-body');

  // Build the table rows
  // Always exactly 3 rows: header, image, content
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [cardBody ? cardBody : '']
  ];

  // Create and insert the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
