/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate accordion blocks
  const accordions = Array.from(element.querySelectorAll(':scope > .accordion'));

  // Prepare header row as per block spec
  const headerRow = ['Accordion (accordion34)'];
  const rows = [headerRow];

  accordions.forEach((accordion) => {
    // Title cell: find the .paragraph-lg inside the .w-dropdown-toggle
    let titleEl = accordion.querySelector('.w-dropdown-toggle .paragraph-lg');
    // Defensive: fallback to first .paragraph-lg if needed
    if (!titleEl) {
      titleEl = accordion.querySelector('.paragraph-lg');
    }

    // Content cell: find the .accordion-content (nav) and get its content
    let contentNav = accordion.querySelector('.accordion-content');
    let contentCell;
    if (contentNav) {
      // Use the entire nav as content cell for resilience
      contentCell = contentNav;
    } else {
      // Defensive: fallback to empty div
      contentCell = document.createElement('div');
    }

    rows.push([titleEl, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
