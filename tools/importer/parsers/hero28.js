/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // 1. Header row
  const headerRow = ['Hero (hero28)'];

  // 2. Find the background image (first .ix-parallax-scale-out-hero img)
  let bgImg;
  const parallaxDiv = element.querySelector('.ix-parallax-scale-out-hero');
  if (parallaxDiv) {
    bgImg = parallaxDiv.querySelector('img');
  }
  // Defensive: If not found, bgImg remains undefined

  // 3. Find the headline and content
  // The headline is inside .container .utility-margin-bottom-6rem h1
  let contentDiv;
  const containerDiv = element.querySelector('.container');
  if (containerDiv) {
    contentDiv = containerDiv.querySelector('.utility-margin-bottom-6rem');
  }

  // Defensive: If not found, contentDiv remains undefined

  // 4. Compose table rows
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''], // 2nd row: background image (optional)
    [contentDiv ? contentDiv : ''], // 3rd row: headline, subheading, CTA (optional)
  ];

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with the block
  element.replaceWith(block);
}
