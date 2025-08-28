/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row: MUST match the example exactly
  const headerRow = ['Accordion (accordion34)'];

  // Prepare all rows for the block table
  const rows = [];
  // Each direct child div is an accordion item
  const accordionItems = element.querySelectorAll(':scope > div');
  accordionItems.forEach((item) => {
    // Title cell: .w-dropdown-toggle > .paragraph-lg, fallback to .w-dropdown-toggle
    const toggle = item.querySelector('.w-dropdown-toggle');
    let titleCell = null;
    if (toggle) {
      const possibleTitle = toggle.querySelector('.paragraph-lg');
      // If the title element exists, use it, else use the whole toggle
      titleCell = possibleTitle || toggle;
    }

    // Content cell: .accordion-content nav > .utility-padding-all-1rem > .rich-text, fallback to .accordion-content
    let contentCell = null;
    const contentNav = item.querySelector('.accordion-content');
    if (contentNav) {
      // Find the first .rich-text inside .utility-padding-all-1rem inside nav
      const pad = contentNav.querySelector('.utility-padding-all-1rem');
      if (pad) {
        const rich = pad.querySelector('.rich-text');
        contentCell = rich || pad;
      } else {
        // fallback to nav itself
        contentCell = contentNav;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Compose the full block table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
