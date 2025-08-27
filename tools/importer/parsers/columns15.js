/* global WebImporter */
export default function parse(element, { document }) {
    // Table header must match example exactly
    const headerRow = ['Columns (columns15)'];
    // Find the two main column contents in the block (for this layout: text + image)
    // The main grid inside the container
    const container = element.querySelector('.container');
    let leftCol = null;
    let rightCol = null;
    if (container) {
        const grid = container.querySelector('.w-layout-grid');
        if (grid) {
            const children = Array.from(grid.children);
            // Find left content: div with h1, p, buttons
            leftCol = children.find(child => child.tagName === 'DIV');
            // Find right content: the main image
            rightCol = children.find(child => child.tagName === 'IMG');
        }
    }
    // Defensive fallback if structure is different
    if (!leftCol && container) {
        leftCol = container.querySelector('div');
    }
    if (!rightCol && container) {
        rightCol = container.querySelector('img');
    }
    // For left column: collect all direct children with content
    let leftCell = [];
    if (leftCol) {
        leftCell = Array.from(leftCol.childNodes).filter(node => {
            // Keep elements and non-empty text nodes
            return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
        });
        // If nothing is found, fallback to leftCol itself
        if (leftCell.length === 0) leftCell = [leftCol];
    }
    // For right column: always image element itself
    let rightCell = rightCol ? [rightCol] : [];
    // Compose cells array (header, row)
    const cells = [headerRow, [leftCell, rightCell]];
    // Create table block
    const block = WebImporter.DOMUtils.createTable(cells, document);
    // Replace original element
    element.replaceWith(block);
}
