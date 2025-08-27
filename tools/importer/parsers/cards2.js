/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards2) header row
  const headerRow = ['Cards (cards2)'];
  const cells = [headerRow];

  // The main container of cards
  const container = element.querySelector('.container');
  if (!container) return;
  const grid = container.querySelector('.grid-layout');
  if (!grid) return;

  // Find the first big card (left side)
  const firstCard = grid.querySelector('a.utility-link-content-block');
  if (firstCard) {
    // Image
    let image = null;
    const imgWrap = firstCard.querySelector('.utility-aspect-1x1, .utility-aspect-3x2');
    if (imgWrap) {
      image = imgWrap.querySelector('img');
    }
    // Tag (optional)
    const tagGroup = firstCard.querySelector('.tag-group');
    // Heading (h2 or h3)
    const heading = firstCard.querySelector('h2, h3');
    // Description
    const desc = firstCard.querySelector('p');
    // Compose text cell, referencing elements directly
    const content = [];
    if (tagGroup) content.push(tagGroup);
    if (heading) content.push(heading);
    if (desc) content.push(desc);
    cells.push([
      image || '',
      content
    ]);
  }

  // Find the right group (flex-horizontal, with two cards with images)
  // There are two flex-horizontal groups, the first one has image cards
  const flexGroups = Array.from(grid.querySelectorAll('.flex-horizontal.flex-vertical.flex-gap-sm'));
  let imageCardsGroup = null;
  let textCardsGroup = null;
  if (flexGroups.length === 2) {
    imageCardsGroup = flexGroups[0];
    textCardsGroup = flexGroups[1];
  }
  // Two image cards on the right
  if (imageCardsGroup) {
    const imageCards = Array.from(imageCardsGroup.querySelectorAll('a.utility-link-content-block')).slice(0,2);
    imageCards.forEach(card => {
      let image = null;
      const imgWrap = card.querySelector('.utility-aspect-3x2');
      if (imgWrap) {
        image = imgWrap.querySelector('img');
      }
      const tagGroup = card.querySelector('.tag-group');
      const heading = card.querySelector('h3, h4');
      const desc = card.querySelector('p');
      const content = [];
      if (tagGroup) content.push(tagGroup);
      if (heading) content.push(heading);
      if (desc) content.push(desc);
      cells.push([
        image || '',
        content
      ]);
    });
    // The third image card (optional)
    if (imageCardsGroup.querySelectorAll('a.utility-link-content-block').length > 2) {
      const thirdImgCard = imageCardsGroup.querySelectorAll('a.utility-link-content-block')[2];
      if (thirdImgCard) {
        let image = null;
        const imgWrap = thirdImgCard.querySelector('.utility-aspect-3x2');
        if (imgWrap) {
          image = imgWrap.querySelector('img');
        }
        const tagGroup = thirdImgCard.querySelector('.tag-group');
        const heading = thirdImgCard.querySelector('h3, h4');
        const desc = thirdImgCard.querySelector('p');
        const content = [];
        if (tagGroup) content.push(tagGroup);
        if (heading) content.push(heading);
        if (desc) content.push(desc);
        cells.push([
          image || '',
          content
        ]);
      }
    }
  }

  // Now, for the vertical stack of text-only cards on the right (each separated by .divider)
  if (textCardsGroup) {
    // Find all a.utility-link-content-block children (these are our cards)
    const textCards = Array.from(textCardsGroup.querySelectorAll('a.utility-link-content-block'));
    textCards.forEach(card => {
      const heading = card.querySelector('h3, h4');
      const desc = card.querySelector('p');
      const content = [];
      if (heading) content.push(heading);
      if (desc) content.push(desc);
      cells.push([
        '',
        content
      ]);
    });
  }

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
