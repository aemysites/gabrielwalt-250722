/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion block (must exactly match example)
  const headerRow = ['Accordion (accordion34)'];
  const rows = [headerRow];

  // Get all accordion items: immediate children divs with accordion class
  const accordionItems = Array.from(element.querySelectorAll(':scope > div.accordion'));

  accordionItems.forEach((item) => {
    // Title: .w-dropdown-toggle > .paragraph-lg (fallback to .w-dropdown-toggle)
    let titleElement = item.querySelector('.w-dropdown-toggle .paragraph-lg');
    if (!titleElement) {
      // fallback: use .w-dropdown-toggle itself if .paragraph-lg missing
      titleElement = item.querySelector('.w-dropdown-toggle');
    }
    // Defensive: if titleElement still not found, fallback to an empty div
    if (!titleElement) {
      titleElement = document.createElement('div');
    }
    // Content: .accordion-content (nav) - we want the inner .utility-padding... or .rich-text content
    let contentNav = item.querySelector('.accordion-content');
    let contentCell;
    if (contentNav) {
      // Find the main content container inside nav
      // Usually the first .utility-padding... under nav
      let padDiv = contentNav.querySelector('.utility-padding-all-1rem');
      if (padDiv) {
        // If it has .rich-text, use that, else use padDiv itself
        let richText = padDiv.querySelector('.rich-text');
        if (richText) {
          contentCell = richText;
        } else {
          contentCell = padDiv;
        }
      } else {
        // fallback: use the nav itself
        contentCell = contentNav;
      }
    } else {
      // fallback: empty div
      contentCell = document.createElement('div');
    }
    // Add row to rows
    rows.push([titleElement, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
