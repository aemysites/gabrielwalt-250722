/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name
  const headerRow = ['Cards (cards24)'];

  // Find all direct card links
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  const rows = cards.map(card => {
    // 1st cell: image (first img inside first child div)
    let imgCell = null;
    const imgDiv = card.querySelector(':scope > div:nth-child(1)');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) imgCell = img;
    }

    // 2nd cell: text content
    const textCellContent = [];
    // Tag & date row (optional)
    const metaDiv = card.querySelector(':scope > div:nth-child(2)');
    if (metaDiv) {
      // Compose a single line for tag and date (keep as inline semantics)
      const tag = metaDiv.querySelector('.tag');
      const date = metaDiv.querySelector('.paragraph-sm');
      if (tag || date) {
        const meta = document.createElement('div');
        if (tag) meta.appendChild(tag);
        if (date) meta.appendChild(date);
        textCellContent.push(meta);
      }
    }
    // Title (h3)
    const title = card.querySelector('h3');
    if (title) textCellContent.push(title);

    // 2nd cell may contain meta div and h3.
    rows: return [imgCell, textCellContent];
  });

  // Compose final table (header row, then each card row)
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}