/* global WebImporter */
export default function parse(element, { document }) {
  // Row 1: Header
  const headerRow = ['Hero (hero12)'];

  // Row 2: Background image (optional)
  let bgImgCell = '';
  const bgImg = element.querySelector('.cover-image.utility-position-absolute');
  if (bgImg) {
    bgImgCell = bgImg.cloneNode(true);
  }

  // Row 3: Content (headline, subheading, CTA, etc.)
  let contentCell = '';
  const cardBody = element.querySelector('.card-body');
  if (cardBody) {
    // Collect all relevant content blocks (including nested images, headings, paragraphs, buttons)
    const grid = cardBody.querySelector('.grid-layout');
    if (grid) {
      // The first child is the inner image, the second is the content
      const gridChildren = Array.from(grid.children);
      if (gridChildren.length > 1) {
        // Compose a fragment to include all content (headings, lists, buttons)
        const frag = document.createElement('div');
        // Headline
        const headline = gridChildren[1].querySelector('h2');
        if (headline) frag.appendChild(headline.cloneNode(true));
        // List items (paragraphs with icons)
        const flexVertical = gridChildren[1].querySelector('.flex-vertical');
        if (flexVertical) {
          Array.from(flexVertical.children).forEach(child => {
            if (child.classList.contains('flex-horizontal')) {
              frag.appendChild(child.cloneNode(true));
            } else if (child.classList.contains('divider')) {
              frag.appendChild(child.cloneNode(true));
            }
          });
        }
        // CTA button
        const buttonGroup = gridChildren[1].querySelector('.button-group');
        if (buttonGroup) frag.appendChild(buttonGroup.cloneNode(true));
        contentCell = frag;
      } else {
        contentCell = gridChildren[0].cloneNode(true);
      }
    } else {
      contentCell = cardBody.cloneNode(true);
    }
  }

  // Compose table rows
  const cells = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
