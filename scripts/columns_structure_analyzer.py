#!/usr/bin/env python3
"""
Columns Structure Analyzer - Compare original WKND vs current columns implementation
"""

import asyncio
from playwright.async_api import async_playwright

async def analyze_columns():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await p.new_page()
        
        results = {'original': {}, 'current': {}, 'differences': []}
        
        # Analyze Original WKND
        print("🔍 Analyzing original WKND Columns...")
        await page.goto('https://www.wknd-trendsetters.site/')
        await page.wait_for_timeout(3000)
        
        original_analysis = await page.evaluate('''() => {
            const columns = document.querySelectorAll('[class*="column"], [class*="grid"]');
            const analysis = { sections: [], common_styles: {} };
            
            columns.forEach((col, i) => {
                if (i >= 5) return; // Limit to first 5 for analysis
                
                const style = getComputedStyle(col);
                const rect = col.getBoundingClientRect();
                
                analysis.sections.push({
                    className: col.className,
                    display: style.display,
                    flexDirection: style.flexDirection,
                    gap: style.gap,
                    gridGap: style.gridGap,
                    alignItems: style.alignItems,
                    justifyContent: style.justifyContent,
                    padding: style.padding,
                    margin: style.margin,
                    width: rect.width,
                    height: rect.height
                });
            });
            
            return analysis;
        }''')
        
        results['original'] = original_analysis
        
        # Analyze Current site
        print("🔍 Analyzing current Columns...")
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/')
        await page.wait_for_timeout(3000)
        
        current_analysis = await page.evaluate('''() => {
            const columns = document.querySelectorAll('.columns');
            const analysis = { sections: [], common_styles: {} };
            
            columns.forEach((col, i) => {
                if (i >= 5) return; // Limit to first 5
                
                const style = getComputedStyle(col);
                const rect = col.getBoundingClientRect();
                
                analysis.sections.push({
                    className: col.className,
                    display: style.display,
                    flexDirection: style.flexDirection,
                    gap: style.gap,
                    gridGap: style.gridGap,
                    alignItems: style.alignItems,
                    justifyContent: style.justifyContent,
                    padding: style.padding,
                    margin: style.margin,
                    width: rect.width,
                    height: rect.height
                });
            });
            
            return analysis;
        }''')
        
        results['current'] = current_analysis
        
        await browser.close()
        
        # Generate differences
        orig_count = len(results['original']['sections'])
        curr_count = len(results['current']['sections'])
        
        results['differences'].append(f"Section count: Original={orig_count}, Current={curr_count}")
        
        if orig_count > 0 and curr_count > 0:
            orig_first = results['original']['sections'][0]
            curr_first = results['current']['sections'][0]
            
            if orig_first['gap'] != curr_first['gap']:
                results['differences'].append(f"Gap: Original='{orig_first['gap']}' vs Current='{curr_first['gap']}'")
            
            if orig_first['alignItems'] != curr_first['alignItems']:
                results['differences'].append(f"Align: Original='{orig_first['alignItems']}' vs Current='{curr_first['alignItems']}'")
        
        return results

async def main():
    print("=" * 60)
    print("COLUMNS STRUCTURE ANALYSIS")
    print("=" * 60)
    
    results = await analyze_columns()
    
    print("\n🎯 KEY DIFFERENCES:")
    for diff in results['differences']:
        print(f"  • {diff}")
    
    print(f"\n📊 ORIGINAL COLUMNS: {len(results['original']['sections'])}")
    for i, section in enumerate(results['original']['sections'][:3]):
        print(f"  {i+1}. {section['className']}")
        print(f"     Display: {section['display']}, Gap: {section['gap']}")
        print(f"     Align: {section['alignItems']}")
    
    print(f"\n📊 CURRENT COLUMNS: {len(results['current']['sections'])}")
    for i, section in enumerate(results['current']['sections'][:3]):
        print(f"  {i+1}. {section['className']}")
        print(f"     Display: {section['display']}, Gap: {section['gap']}")
        print(f"     Align: {section['alignItems']}")

if __name__ == "__main__":
    asyncio.run(main())