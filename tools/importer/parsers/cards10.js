/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists and is a grid of cards
  if (!element || !element.classList.contains('grid-layout')) return;

  // Table header as required
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Get all direct card links (each card is an <a>)
  const cards = element.querySelectorAll(':scope > a.card-link');

  cards.forEach((card) => {
    // Find the image container (first child div with aspect ratio class)
    const imageContainer = card.querySelector('.utility-aspect-3x2');
    let img = imageContainer ? imageContainer.querySelector('img') : null;
    // Defensive: If no image, skip card
    if (!img) return;

    // Find the content container (second child div)
    const contentContainer = card.querySelector('.utility-padding-all-1rem');
    // Defensive: If no content, skip card
    if (!contentContainer) return;

    // Compose the text cell: include tag, heading, paragraph
    // We'll reference the whole contentContainer for resilience
    rows.push([img, contentContainer]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
