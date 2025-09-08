import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('Cards block classes:', block.className); // Debug log
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    
    // Special handling for cards33: wrap first two paragraphs in inline container
    if (block.classList.contains('cards33')) {
      const cardBody = li.querySelector('.cards-card-body');
      if (cardBody) {
        const paragraphs = cardBody.querySelectorAll('p');
        console.log('Cards33 detected, paragraphs found:', paragraphs.length); // Debug log
        if (paragraphs.length >= 2) {
          // Create wrapper div for first two paragraphs
          const inlineWrapper = document.createElement('div');
          inlineWrapper.className = 'cards-inline-meta';
          
          // Move first two paragraphs into wrapper
          inlineWrapper.append(paragraphs[0]);
          inlineWrapper.append(paragraphs[1]);
          
          // Insert wrapper at the beginning of card body
          cardBody.insertBefore(inlineWrapper, cardBody.firstChild);
          console.log('Cards33 inline wrapper created'); // Debug log
        }
      }
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
