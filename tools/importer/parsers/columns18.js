/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container
  const grid = element.querySelector('.grid-layout');
  if (!grid) return;

  // Get all direct children of the grid
  const gridChildren = Array.from(grid.children);

  // Left column: heading, subheading, paragraph
  const leftCol = gridChildren.find(child => child.querySelector('h2, h3, p'));
  let leftContent = '';
  if (leftCol) {
    // Collect all text content in order
    const parts = [];
    const h2 = leftCol.querySelector('h2');
    if (h2) parts.push(h2.textContent.trim());
    const h3 = leftCol.querySelector('h3');
    if (h3) parts.push(h3.textContent.trim());
    const p = leftCol.querySelector('p');
    if (p) parts.push(p.textContent.trim());
    leftContent = parts.join('\n\n');
  }

  // Right column: contact list (ul)
  const rightCol = gridChildren.find(child => child.querySelector('ul'));
  let rightContent = '';
  if (rightCol) {
    const ul = rightCol.querySelector('ul');
    if (ul) {
      // For each li, collect icon (as SVG), heading, and value
      const lis = Array.from(ul.querySelectorAll('li'));
      rightContent = lis.map(li => {
        const iconDiv = li.querySelector('.icon-container');
        let icon = '';
        if (iconDiv && iconDiv.querySelector('svg')) {
          icon = iconDiv.querySelector('svg').outerHTML;
        }
        const heading = li.querySelector('h4') ? li.querySelector('h4').textContent.trim() : '';
        let value = '';
        const a = li.querySelector('a');
        if (a) {
          value = a.textContent.trim();
        } else {
          // fallback to div (for phone/address)
          const divs = li.querySelectorAll('div');
          if (divs.length > 1) {
            value = divs[1].textContent.trim();
          }
        }
        return `${icon}\n${heading}\n${value}`.trim();
      }).join('\n\n');
    }
  }

  // Image column
  const imgCol = gridChildren.find(child => child.querySelector('img')) || grid.querySelector('img');
  let imgContent = '';
  if (imgCol) {
    const img = imgCol.querySelector('img') || imgCol;
    if (img) {
      const clone = img.cloneNode();
      imgContent = clone;
    }
  }

  // Compose columns
  const columns = [leftContent, rightContent, imgContent].filter(col => col && (typeof col === 'string' ? col.trim() : true));

  // Table header must match block name exactly
  const headerRow = ['Columns (columns18)'];

  if (columns.length > 0) {
    const table = WebImporter.DOMUtils.createTable([headerRow, columns], document);
    element.replaceWith(table);
  }
}
