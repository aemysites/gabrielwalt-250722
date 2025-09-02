/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text content from a card anchor
  function extractCardContent(cardAnchor) {
    // Find image container (may be absent)
    const imgContainer = cardAnchor.querySelector('.utility-aspect-1x1, .utility-aspect-3x2');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // Compose text content: tag, heading, paragraph
    const textParts = [];
    const tagGroup = cardAnchor.querySelector('.tag-group');
    if (tagGroup) {
      textParts.push(tagGroup);
    }
    // Heading (h2 or h3)
    const heading = cardAnchor.querySelector('h2, h3');
    if (heading) {
      textParts.push(heading);
    }
    // Paragraph
    const para = cardAnchor.querySelector('p');
    if (para) {
      textParts.push(para);
    }
    return [imgEl, textParts];
  }

  // Find the grid layout containing the cards
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // First card (large, left)
  const firstCardAnchor = gridChildren.find(el => el.tagName === 'A');
  const firstCardRow = extractCardContent(firstCardAnchor);

  // Second column: vertical stack of two cards (with images)
  const secondCol = gridChildren.find(el => el.classList.contains('flex-horizontal'));
  // Get all card anchors inside secondCol
  const secondColCards = Array.from(secondCol.querySelectorAll('a.utility-link-content-block'));
  const secondColRows = secondColCards.map(extractCardContent);

  // Third column: vertical stack of text-only cards (no images)
  const thirdColIndex = gridChildren.indexOf(secondCol) + 1;
  const thirdColEl = gridChildren[thirdColIndex];
  let thirdColRows = [];
  if (thirdColEl) {
    // Get all card anchors inside thirdColEl
    const textCardAnchors = Array.from(thirdColEl.querySelectorAll('a.utility-link-content-block'));
    thirdColRows = textCardAnchors.map(anchor => {
      // No image, just heading and paragraph
      const textParts = [];
      const heading = anchor.querySelector('h3');
      if (heading) textParts.push(heading);
      const para = anchor.querySelector('p');
      if (para) textParts.push(para);
      return [null, textParts];
    });
  }

  // Compose all card rows
  const cardRows = [firstCardRow, ...secondColRows, ...thirdColRows];

  // Table header
  const headerRow = ['Cards (cards2)'];
  // Build table rows: each row is [image, text content]
  const tableRows = cardRows.map(([img, textParts]) => {
    // If no image, use empty string for cell
    return [img || '', textParts];
  });

  // Compose table data
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
