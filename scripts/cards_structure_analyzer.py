#!/usr/bin/env python3
"""
Cards Structure Analyzer - Compare original WKND vs current implementation
Uses Playwright to extract computed styles and structure for precise comparison
"""

import asyncio
import json
from playwright.async_api import async_playwright

async def analyze_cards_structure():
    """Analyze Cards block structure on both sites"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        results = {
            'original_wknd': {},
            'current_gabrielwalt': {},
            'differences': []
        }
        
        # Analyze Original WKND site
        print("🔍 Analyzing original WKND Cards structure...")
        await page.goto('https://www.wknd-trendsetters.site/')
        await page.wait_for_timeout(3000)
        
        # Get cards structure and styles
        original_analysis = await page.evaluate('''() => {
            const analysis = {
                cards_sections: [],
                layout_info: {},
                styles: {}
            };
            
            // Find all cards-like sections
            const cardsSections = document.querySelectorAll('.cards, [class*="cards"], [class*="grid"]');
            
            cardsSections.forEach((section, index) => {
                const computedStyle = getComputedStyle(section);
                const rect = section.getBoundingClientRect();
                
                analysis.cards_sections.push({
                    index: index,
                    className: section.className,
                    tagName: section.tagName,
                    children_count: section.children.length,
                    dimensions: {
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left
                    },
                    computed_styles: {
                        display: computedStyle.display,
                        grid_template_columns: computedStyle.gridTemplateColumns,
                        grid_gap: computedStyle.gridGap,
                        gap: computedStyle.gap,
                        padding: computedStyle.padding,
                        margin: computedStyle.margin,
                        background: computedStyle.background,
                        border: computedStyle.border
                    }
                });
            });
            
            return analysis;
        }''')
        
        results['original_wknd'] = original_analysis
        
        # Analyze Current gabrielwalt site
        print("🔍 Analyzing current gabrielwalt Cards structure...")
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/')
        await page.wait_for_timeout(3000)
        
        current_analysis = await page.evaluate('''() => {
            const analysis = {
                cards_sections: [],
                layout_info: {},
                styles: {}
            };
            
            // Find all cards sections
            const cardsSections = document.querySelectorAll('.cards, [class*="cards"]');
            
            cardsSections.forEach((section, index) => {
                const computedStyle = getComputedStyle(section);
                const rect = section.getBoundingClientRect();
                
                analysis.cards_sections.push({
                    index: index,
                    className: section.className,
                    tagName: section.tagName,
                    children_count: section.children.length,
                    dimensions: {
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left
                    },
                    computed_styles: {
                        display: computedStyle.display,
                        grid_template_columns: computedStyle.gridTemplateColumns,
                        grid_gap: computedStyle.gridGap,
                        gap: computedStyle.gap,
                        padding: computedStyle.padding,
                        margin: computedStyle.margin,
                        background: computedStyle.background,
                        border: computedStyle.border
                    }
                });
            });
            
            return analysis;
        }''')
        
        results['current_gabrielwalt'] = current_analysis
        
        await browser.close()
        
        # Generate comparison insights
        results['differences'] = generate_differences(original_analysis, current_analysis)
        
        return results

def generate_differences(original, current):
    """Generate actionable differences between structures"""
    differences = []
    
    orig_sections = original.get('cards_sections', [])
    curr_sections = current.get('cards_sections', [])
    
    differences.append(f"Section count: Original={len(orig_sections)}, Current={len(curr_sections)}")
    
    # Compare first sections (assuming main cards)
    if orig_sections and curr_sections:
        orig_main = orig_sections[0]
        curr_main = curr_sections[0]
        
        # Layout differences
        orig_grid = orig_main['computed_styles']['grid_template_columns']
        curr_grid = curr_main['computed_styles']['grid_template_columns']
        if orig_grid != curr_grid:
            differences.append(f"Grid layout: Original='{orig_grid}' vs Current='{curr_grid}'")
        
        # Gap differences
        orig_gap = orig_main['computed_styles']['gap'] or orig_main['computed_styles']['grid_gap']
        curr_gap = curr_main['computed_styles']['gap'] or curr_main['computed_styles']['grid_gap']
        if orig_gap != curr_gap:
            differences.append(f"Grid gap: Original='{orig_gap}' vs Current='{curr_gap}'")
        
        # Dimension differences
        orig_dims = orig_main['dimensions']
        curr_dims = curr_main['dimensions']
        width_diff = abs(orig_dims['width'] - curr_dims['width'])
        if width_diff > 10:
            differences.append(f"Width difference: {width_diff:.1f}px (Original={orig_dims['width']:.1f}, Current={curr_dims['width']:.1f})")
    
    return differences

async def main():
    """Main execution function"""
    print("=" * 60)
    print("CARDS STRUCTURE ANALYSIS")
    print("=" * 60)
    
    results = await analyze_cards_structure()
    
    print("\n🎯 KEY FINDINGS:")
    for diff in results['differences']:
        print(f"  • {diff}")
    
    print(f"\n📊 ORIGINAL CARDS SECTIONS: {len(results['original_wknd']['cards_sections'])}")
    for i, section in enumerate(results['original_wknd']['cards_sections'][:3]):
        print(f"  {i+1}. {section['className']} - {section['computed_styles']['display']}")
        print(f"     Grid: {section['computed_styles']['grid_template_columns']}")
        print(f"     Gap: {section['computed_styles']['gap'] or section['computed_styles']['grid_gap']}")
    
    print(f"\n📊 CURRENT CARDS SECTIONS: {len(results['current_gabrielwalt']['cards_sections'])}")
    for i, section in enumerate(results['current_gabrielwalt']['cards_sections'][:3]):
        print(f"  {i+1}. {section['className']} - {section['computed_styles']['display']}")
        print(f"     Grid: {section['computed_styles']['grid_template_columns']}")
        print(f"     Gap: {section['computed_styles']['gap'] or section['computed_styles']['grid_gap']}")
    
    # Save detailed analysis
    with open('/workspace/tmp/cards_structure_analysis.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Detailed analysis saved to: /workspace/tmp/cards_structure_analysis.json")

if __name__ == "__main__":
    asyncio.run(main())