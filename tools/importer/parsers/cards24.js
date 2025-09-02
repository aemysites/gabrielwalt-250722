/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Get all cards (each is an <a> inside the grid)
  const cards = Array.from(element.querySelectorAll(':scope > a.utility-link-content-block'));

  cards.forEach(card => {
    // Image: first child div contains the image
    const imageContainer = card.querySelector(':scope > div');
    const img = imageContainer ? imageContainer.querySelector('img') : null;

    // Text content cell
    const textContent = document.createElement('div');

    // Tag and date row
    const metaRow = card.querySelector('.flex-horizontal');
    if (metaRow) {
      // Defensive: clone or append both tag and date
      const tag = metaRow.querySelector('.tag');
      const date = metaRow.querySelector('.paragraph-sm');
      const metaDiv = document.createElement('div');
      if (tag) metaDiv.appendChild(tag.cloneNode(true));
      if (date) metaDiv.appendChild(date.cloneNode(true));
      textContent.appendChild(metaDiv);
    }

    // Heading
    const heading = card.querySelector('h3');
    if (heading) {
      textContent.appendChild(heading.cloneNode(true));
    }

    // Build row: [image, textContent]
    rows.push([
      img,
      textContent
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
