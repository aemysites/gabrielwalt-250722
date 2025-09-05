# Variant Reduction Strategy for gabrielwalt-250722

## Current State Analysis

### Column Blocks (16 variants → 4 base types)

After analyzing the parsers, the column variants can be reduced to:

#### 1. **Single Column** (full-width content)
- Current: columns1, columns3, columns4
- New: `columns-single`
- Use case: Full-width content blocks

#### 2. **Two Columns** (50/50 or 60/40 split)
- Current: columns7, columns9, columns11, columns14, columns15
- New: `columns-two`
- CSS modifier classes for splits: `.columns-equal`, `.columns-60-40`

#### 3. **Three Columns** (equal thirds)
- Current: columns18, columns26, columns27
- New: `columns-three`
- Use case: Feature grids, service listings

#### 4. **Image Gallery** (flexible grid)
- Current: columns29, columns30, columns31, columns32, columns38
- New: `columns-gallery`
- CSS Grid with auto-fit for responsive layouts

### Card Blocks (8 variants → 3 base types)

#### 1. **Standard Cards** (with images)
- Current: cards2, cards10, cards17, cards23, cards24, cards25
- New: `cards`
- Modifiers: `.cards-horizontal`, `.cards-vertical`, `.cards-compact`

#### 2. **Text-Only Cards** 
- Current: cardsNoImages19
- New: `cards-text`
- Use case: Feature lists, text-heavy content

#### 3. **Link Cards** (utility links)
- Current: cards33, cards37
- New: `cards-links`
- Use case: Navigation cards, category links

## Implementation Strategy

### Phase 1: CSS Consolidation

```css
/* Base column styles - applies to ALL column variants */
.columns {
  display: grid;
  gap: var(--spacing-lg);
  align-items: start;
}

/* Variant modifiers */
.columns.columns-single {
  grid-template-columns: 1fr;
}

.columns.columns-two {
  grid-template-columns: 1fr 1fr;
}

.columns.columns-three {
  grid-template-columns: repeat(3, 1fr);
}

.columns.columns-gallery {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Responsive overrides */
@media (max-width: 768px) {
  .columns.columns-two,
  .columns.columns-three {
    grid-template-columns: 1fr;
  }
}
```

### Phase 2: Parser Consolidation

Create unified parsers that detect content patterns:

```javascript
// Unified column parser
export default function parseColumns(element, { document }) {
  const columns = detectColumns(element);
  const variant = determineVariant(columns.length);
  
  return WebImporter.DOMUtils.createTable([
    [`Columns (${variant})`],
    columns
  ], document);
}

function determineVariant(count) {
  switch(count) {
    case 1: return 'columns-single';
    case 2: return 'columns-two';
    case 3: return 'columns-three';
    default: return 'columns-gallery';
  }
}
```

### Phase 3: Content Migration

Update inventory.json mappings:
- Map old variants to new consolidated versions
- Maintain backwards compatibility during transition
- Update SharePoint documents to use new variants

## Benefits

1. **Reduced Complexity**: 24 variants → 7 base types (70% reduction)
2. **Easier Maintenance**: Single source of truth for each pattern
3. **Better Performance**: Less CSS to download and parse
4. **Improved Consistency**: Standardized spacing and responsive behavior
5. **Simplified Authoring**: Clearer choices for content creators

## Migration Path

1. **Week 1**: Create new consolidated CSS
2. **Week 2**: Update parsers to use new variants
3. **Week 3**: Test and validate all pages
4. **Week 4**: Update documentation and train authors