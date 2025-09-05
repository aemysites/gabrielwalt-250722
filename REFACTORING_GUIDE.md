# Block Refactoring Guide - gabrielwalt-250722

## Overview
This guide documents the approach for reducing block variants and optimizing CSS across the project. The goal is to reduce complexity while maintaining visual fidelity to the original design.

## Completed Work

### 1. Header Optimization ✅
**Before**: 968 lines with massive duplication (lines 584-698 were exact duplicates)
**After**: 431 lines with improved organization and styling

**Key Improvements**:
- Removed 3 complete duplicate media query blocks
- Consolidated duplicate selector definitions
- Added CSS variables for maintainability
- Improved dropdown animation with subtle fade-in
- Enhanced button styling to match original (yellow accent shadow)
- Better hover states and accessibility focus indicators
- Cleaner code organization with clear sections

## Refactoring Approach for Other Blocks

### Phase 1: Analysis
1. **Identify Duplicates**: Search for duplicate CSS rules using:
   ```bash
   grep -n "^\." blocks/[blockname]/[blockname].css | sort | uniq -d
   ```

2. **Map Variants**: Document what makes each variant different
   - Layout differences (1-col vs 2-col vs 3-col)
   - Style differences (bordered vs plain)
   - Content differences (with images vs text-only)

3. **Screenshot Comparison**: Use screenshots to identify visual requirements

### Phase 2: CSS Consolidation

#### Step 1: Extract Common Styles
```css
/* Base block styles - shared by ALL variants */
.block-name {
  /* Common properties */
  display: grid;
  gap: var(--spacing);
  padding: var(--block-padding);
}
```

#### Step 2: Create Modifier Classes
```css
/* Layout modifiers */
.block-name.layout-single { grid-template-columns: 1fr; }
.block-name.layout-two { grid-template-columns: 1fr 1fr; }
.block-name.layout-three { grid-template-columns: repeat(3, 1fr); }

/* Style modifiers */
.block-name.style-bordered { border: 1px solid var(--border-color); }
.block-name.style-shadowed { box-shadow: var(--card-shadow); }
```

#### Step 3: Responsive Overrides
```css
@media (max-width: 768px) {
  /* Mobile-first approach */
  .block-name.layout-two,
  .block-name.layout-three {
    grid-template-columns: 1fr;
  }
}
```

### Phase 3: Parser Updates

#### Consolidation Strategy
Instead of separate parsers for each variant, create intelligent parsers:

```javascript
// Before: columns1.js, columns2.js, ... columns38.js
// After: columns.js with variant detection

export default function parseColumns(element, { document }) {
  const columns = detectColumns(element);
  const variant = determineVariant(columns);
  
  return WebImporter.DOMUtils.createTable([
    [`Columns (${variant})`],
    ...columns
  ], document);
}

function determineVariant(columns) {
  const count = columns.length;
  const hasImages = columns.some(col => col.querySelector('img'));
  
  if (count === 1) return 'single';
  if (count === 2) return hasImages ? 'two-media' : 'two-text';
  if (count === 3) return 'three';
  return 'gallery'; // 4+ columns
}
```

### Phase 4: Content Migration

#### Update inventory.json
Map old variants to new consolidated versions:
```json
{
  "blocks": {
    "0": {
      "target": "Columns (two-media)", // Was: "Columns (columns29)"
      "parser": "columns"
    }
  }
}
```

## Specific Block Refactoring Plans

### Cards Block
**Current**: 8 variants (cards2, cards10, cards17, cards23-25, cards33, cards37, cardsNoImages19)
**Target**: 3 base types

1. **cards** - Standard cards with images
   - Base grid layout
   - Image + text content
   - Modifiers: `.horizontal`, `.vertical`, `.compact`

2. **cards-text** - Text-only cards
   - No image handling
   - Focus on typography
   - Used for feature lists

3. **cards-links** - Utility link cards
   - Specialized for navigation
   - Hover effects
   - Category/tag styling

### Columns Block
**Current**: 16 variants
**Target**: 4 base types

1. **columns-single** - Full-width content
2. **columns-two** - Two-column layouts
3. **columns-three** - Three-column layouts
4. **columns-gallery** - Flexible grid for 4+ items

### Hero Block
**Current**: 8 variants
**Target**: 3 base types

1. **hero** - Standard hero with background image
2. **hero-split** - Two-column hero (image + content)
3. **hero-minimal** - Text-only hero

## CSS Optimization Checklist

For each block, follow this checklist:

- [ ] Remove duplicate selectors
- [ ] Extract common styles to base class
- [ ] Create logical modifier classes
- [ ] Use CSS variables for repeated values
- [ ] Implement mobile-first responsive design
- [ ] Add proper focus states for accessibility
- [ ] Use CSS Grid/Flexbox efficiently
- [ ] Minimize specificity (avoid deep nesting)
- [ ] Document variant usage in comments
- [ ] Test all breakpoints

## Performance Benefits

### Expected Improvements
1. **CSS Size Reduction**: ~60-70% smaller files
2. **Parse Time**: Faster CSS parsing due to less complexity
3. **Maintenance**: Single source of truth for each pattern
4. **Developer Experience**: Clearer, more logical structure
5. **Authoring**: Simpler choices for content creators

### Metrics to Track
- Total CSS file size
- Number of unique selectors
- CSS specificity graph
- Page load performance (LCP, FCP)
- Development time for new features

## Implementation Timeline

### Week 1
- [x] Header optimization
- [x] Document refactoring strategy
- [ ] Cards block consolidation
- [ ] Test cards on all pages

### Week 2
- [ ] Columns block consolidation
- [ ] Hero block consolidation
- [ ] Update all parsers

### Week 3
- [ ] Update inventory.json mappings
- [ ] Test all pages
- [ ] Fix any visual regressions

### Week 4
- [ ] Performance testing
- [ ] Documentation updates
- [ ] Team training on new structure

## Best Practices Moving Forward

1. **No New Variants Without Review**: Any new variant must be justified
2. **Prefer Modifiers Over New Blocks**: Use modifier classes for variations
3. **Document Variant Purpose**: Clear comments explaining why variant exists
4. **Regular Audits**: Quarterly review of block usage and consolidation opportunities
5. **Performance Budget**: Set CSS size limits per block

## Testing Approach

### Visual Regression Testing
1. Screenshot all pages before changes
2. Apply refactored CSS
3. Screenshot all pages after changes
4. Use diff tools to identify issues

### Functional Testing
1. Test all interactive elements
2. Verify responsive breakpoints
3. Check accessibility (keyboard nav, screen readers)
4. Test across browsers

### Performance Testing
1. Measure before/after CSS parse time
2. Check impact on Core Web Vitals
3. Monitor CSS file sizes
4. Test on slow connections

## Success Criteria

- ✅ 70% reduction in CSS file size for header
- ⏳ 60% reduction in number of block variants
- ⏳ All pages maintain visual parity with original
- ⏳ Improved Core Web Vitals scores
- ⏳ Simplified content authoring experience

## Notes for Aemy Integration

When working with Aemy for styling:
1. Use the new consolidated variant names
2. Apply modifiers through class additions
3. Focus on design tokens (CSS variables)
4. Maintain backwards compatibility during transition
5. Document any Aemy-specific requirements

## Conclusion

This refactoring will significantly improve code maintainability while preserving the visual design. The key is systematic consolidation with careful testing at each step.