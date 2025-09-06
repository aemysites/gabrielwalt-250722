#!/usr/bin/env python3
"""
Homepage Tabs Analyzer - Focus on tabs22 block optimization
Analyzes the specific tabs block on homepage for targeted improvements
"""

import asyncio
from playwright.async_api import async_playwright

async def analyze_homepage_tabs():
    """Analyze the tabs22 block specifically"""
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.set_viewport_size({'width': 1600, 'height': 900})
        
        results = {'original': {}, 'current': {}, 'recommendations': []}
        
        # Analyze Original WKND tabs
        print("🔍 Analyzing original WKND tabs structure...")
        await page.goto('https://www.wknd-trendsetters.site/')
        await page.wait_for_timeout(3000)
        
        original_tabs = await page.evaluate('''() => {
            // Look for tab-like structures
            const tabElements = document.querySelectorAll('[class*="tab"], [class*="switch"], [class*="toggle"], [role="tablist"], [role="tab"]');
            const results = [];
            
            tabElements.forEach((element, i) => {
                if (i >= 5) return; // Limit results
                
                const rect = element.getBoundingClientRect();
                const style = getComputedStyle(element);
                
                results.push({
                    selector: element.className || element.tagName,
                    dimensions: {width: rect.width, height: rect.height},
                    styles: {
                        display: style.display,
                        background: style.backgroundColor,
                        borderRadius: style.borderRadius,
                        padding: style.padding,
                        gap: style.gap,
                        fontSize: style.fontSize
                    },
                    content: element.textContent.substring(0, 100)
                });
            });
            
            return results;
        }''')
        
        results['original'] = original_tabs
        
        # Analyze Current tabs22
        print("🔍 Analyzing current tabs22 block...")
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/')
        await page.wait_for_timeout(3000)
        
        current_tabs = await page.evaluate('''() => {
            const tabsElement = document.querySelector('.tabs.tabs22');
            if (!tabsElement) return null;
            
            const rect = tabsElement.getBoundingClientRect();
            const style = getComputedStyle(tabsElement);
            
            // Get tab buttons
            const buttons = Array.from(tabsElement.querySelectorAll('button')).map(btn => {
                const btnRect = btn.getBoundingClientRect();
                const btnStyle = getComputedStyle(btn);
                return {
                    text: btn.textContent,
                    dimensions: {width: btnRect.width, height: btnRect.height},
                    styles: {
                        background: btnStyle.backgroundColor,
                        border: btnStyle.border,
                        borderRadius: btnStyle.borderRadius,
                        padding: btnStyle.padding,
                        fontSize: btnStyle.fontSize
                    }
                };
            });
            
            // Get tab panels
            const panels = Array.from(tabsElement.querySelectorAll('[role="tabpanel"]')).map(panel => {
                const panelRect = panel.getBoundingClientRect();
                return {
                    dimensions: {width: panelRect.width, height: panelRect.height},
                    content_preview: panel.textContent.substring(0, 200)
                };
            });
            
            return {
                block_dimensions: {width: rect.width, height: rect.height},
                block_styles: {
                    display: style.display,
                    background: style.backgroundColor,
                    padding: style.padding,
                    gap: style.gap
                },
                buttons: buttons,
                panels: panels,
                total_impact: rect.width * rect.height
            };
        }''')
        
        results['current'] = current_tabs
        
        await browser.close()
        
        # Generate recommendations
        if current_tabs:
            results['recommendations'].append(f"Block size: {current_tabs['total_impact']:,} pixels")
            
            if current_tabs['buttons']:
                button_styles = current_tabs['buttons'][0]['styles']
                if 'px' in button_styles['padding']:
                    results['recommendations'].append("Replace hardcoded button padding with design system variables")
                if 'px' in button_styles['borderRadius']:
                    results['recommendations'].append("Replace hardcoded border radius with design system variables")
        
        return results

async def main():
    print("=" * 60)
    print("HOMEPAGE TABS22 BLOCK ANALYSIS")
    print("=" * 60)
    
    results = await analyze_homepage_tabs()
    
    if results['current']:
        current = results['current']
        print(f"\\n📊 TABS22 BLOCK ANALYSIS:")
        print(f"Size: {current['block_dimensions']['width']}x{current['block_dimensions']['height']} = {current['total_impact']:,} pixels")
        print(f"Buttons: {len(current['buttons'])}")
        print(f"Panels: {len(current['panels'])}")
        
        print("\\n🎯 OPTIMIZATION RECOMMENDATIONS:")
        for rec in results['recommendations']:
            print(f"  • {rec}")
            
        if current['buttons']:
            btn = current['buttons'][0]
            print(f"\\n🔍 BUTTON ANALYSIS:")
            print(f"  Padding: {btn['styles']['padding']}")
            print(f"  Border radius: {btn['styles']['borderRadius']}")
            print(f"  Background: {btn['styles']['background']}")
    else:
        print("❌ No tabs22 block found on current page")
    
    print(f"\\n📊 Original site tabs found: {len(results['original'])}")

if __name__ == "__main__":
    asyncio.run(main())