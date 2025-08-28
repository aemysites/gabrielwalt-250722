/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main grid: cards are inside the first .grid-layout in the section
  const mainGrid = element.querySelector('.w-layout-grid.grid-layout');
  if (!mainGrid) return;

  // 2. Get all direct card blocks. Some are <a>, some are nested grids with <a> inside.
  const directCards = Array.from(mainGrid.children).filter(el => el.matches('a.utility-link-content-block'));
  // Some cards are inside a nested grid
  const nestedGrid = Array.from(mainGrid.children).find(el => el.matches('.w-layout-grid.grid-layout'));
  const nestedCards = nestedGrid ? Array.from(nestedGrid.children).filter(el => el.matches('a.utility-link-content-block')) : [];

  // Combine all found cards in order
  const cards = [...directCards, ...nestedCards];
  if (cards.length === 0) return;

  // 3. Helper: Extract [image, text] from a card element
  function getCardCells(cardEl) {
    // Find the first <img> (image always present and always inside a div)
    const img = cardEl.querySelector('img');

    // Text content: for big card, it's inside .utility-padding-all-2rem
    // For small cards, it's child elements after the image wrapper
    let textParent = cardEl.querySelector('.utility-padding-all-2rem') || cardEl;
    const imageWrappers = Array.from(cardEl.querySelectorAll('[class*="utility-aspect"]'));
    const textNodes = [];
    Array.from(textParent.childNodes).forEach(node => {
      // Only keep elements/nodes that are not image wrappers
      if (imageWrappers.includes(node)) return;
      textNodes.push(node);
    });
    // If textNodes are empty, fallback to all except image wrappers
    if (textNodes.length === 0) {
      Array.from(cardEl.childNodes).forEach(node => {
        if (imageWrappers.includes(node)) return;
        textNodes.push(node);
      });
    }
    // Wrap them in a div to preserve structure
    const textDiv = document.createElement('div');
    textNodes.forEach(n => textDiv.appendChild(n));
    return [img, textDiv];
  }

  // 4. Build table: header, then one row per card
  const table = [['Cards (cards37)']];
  cards.forEach(cardEl => {
    const [img, textDiv] = getCardCells(cardEl);
    table.push([img, textDiv]);
  });

  // 5. Create the block table and replace element
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
