/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching EXACT example (no hardcoding except block name)
  const headerRow = ['Cards (cards25)'];
  // Each card is a direct child div that contains an image
  const cards = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [];
  cards.forEach(card => {
    // Get image: always present and mandatory, usually first img in card
    const img = card.querySelector('img');
    if (!img) return; // Skip rows without image
    // Get text: find h3 (title) and p (description), both optional
    let textCell = null;
    let h3 = card.querySelector('h3');
    let p = card.querySelector('p');
    // If both h3 and p, combine in order into a fragment
    if (h3 && p) {
      const frag = document.createDocumentFragment();
      frag.appendChild(h3);
      frag.appendChild(p);
      textCell = frag;
    } else if (h3) {
      textCell = h3;
    } else if (p) {
      textCell = p;
    } else {
      // If no h3/p, try to find text content in immediate child divs
      // Sometimes text is present but structure is odd, fallback to div
      const divs = Array.from(card.querySelectorAll(':scope > div'));
      // Pick the first div with text content, if any
      const fallbackDiv = divs.find(div => div.textContent.trim().length > 0);
      textCell = fallbackDiv || '';
    }
    rows.push([img, textCell]);
  });
  // Compose final table: block header + card rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
