/* global WebImporter */
export default function parse(element, { document }) {
  // Table header - matches example
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Get all direct card links (each card is an <a>)
  const cards = element.querySelectorAll(':scope > a.utility-link-content-block');
  cards.forEach(card => {
    // --- First cell: Image ---
    // Image is inside first <div> in card (contains aspect ratio classes)
    const imageDiv = card.querySelector(':scope > div');
    // Use entire imageDiv for correct semantic aspect, not just img
    const firstCell = imageDiv;

    // --- Second cell: Text content ---
    // Compose tag(s), date, heading -- all required for semantic meaning
    const textContent = [];
    // Tag and date container
    const infoRow = card.querySelector('.flex-horizontal');
    if (infoRow) {
      // Tag
      const tag = infoRow.querySelector('.tag');
      if (tag) textContent.push(tag);
      // Date
      const date = infoRow.querySelector('.paragraph-sm');
      if (date) textContent.push(date);
    }
    // Heading
    const heading = card.querySelector('.h4-heading');
    if (heading) textContent.push(heading);
    // No description or CTA in this source, so nothing missed

    // Edge case: if no image or no heading, skip row (should not occur with this HTML)
    if (firstCell && textContent.length) {
      rows.push([firstCell, textContent]);
    }
  });

  // Final table creation
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with new block table
  element.replaceWith(block);
}
