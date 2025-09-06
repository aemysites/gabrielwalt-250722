#!/usr/bin/env python3
"""
Navigation Visual Check - Check if nav is visually broken
"""

import asyncio
from playwright.async_api import async_playwright

async def check_nav_visual():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await p.new_page()
        await page.set_viewport_size({'width': 1600, 'height': 900})
        
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/')
        await page.wait_for_timeout(3000)
        
        # Take screenshot of header area
        await page.locator('header').screenshot(path='/workspace/tmp/current_nav_visual.png')
        
        # Check navigation visibility details
        nav_analysis = await page.evaluate('''() => {
            const header = document.querySelector('header');
            const nav = document.querySelector('header nav');
            
            if (!nav) return {error: 'No nav element found'};
            
            const navStyle = getComputedStyle(nav);
            const navRect = nav.getBoundingClientRect();
            
            // Check nav sections
            const navSections = nav.querySelector('.nav-sections');
            const navSectionsStyle = navSections ? getComputedStyle(navSections) : null;
            const navSectionsRect = navSections ? navSections.getBoundingClientRect() : null;
            
            // Check nav links
            const navLinks = Array.from(nav.querySelectorAll('a')).slice(0, 5);
            const linkAnalysis = navLinks.map(link => ({
                text: link.textContent,
                visible: getComputedStyle(link).display !== 'none',
                opacity: getComputedStyle(link).opacity,
                color: getComputedStyle(link).color,
                position: link.getBoundingClientRect()
            }));
            
            return {
                nav_display: navStyle.display,
                nav_visibility: navStyle.visibility,
                nav_opacity: navStyle.opacity,
                nav_position: navRect,
                nav_sections_display: navSectionsStyle ? navSectionsStyle.display : null,
                nav_sections_position: navSectionsRect,
                links_count: navLinks.length,
                links_analysis: linkAnalysis,
                nav_height: navRect.height,
                nav_width: navRect.width
            };
        }''')
        
        await browser.close()
        return nav_analysis

async def main():
    result = await check_nav_visual()
    
    print("🔍 NAVIGATION VISUAL ANALYSIS:")
    print("=" * 50)
    
    if 'error' in result:
        print(f"❌ {result['error']}")
        return
    
    print(f"Nav Display: {result['nav_display']}")
    print(f"Nav Visibility: {result['nav_visibility']}")
    print(f"Nav Opacity: {result['nav_opacity']}")
    print(f"Nav Size: {result['nav_width']}x{result['nav_height']}")
    print(f"Nav Sections Display: {result['nav_sections_display']}")
    print(f"Links Count: {result['links_count']}")
    
    print("\\nLINKS ANALYSIS:")
    for i, link in enumerate(result['links_analysis'][:3]):
        print(f"  {i+1}. '{link['text'][:20]}' - Visible: {link['visible']}, Color: {link['color']}")
    
    print("\\n📷 Screenshot saved: /workspace/tmp/current_nav_visual.png")
    
    # Check for common issues
    issues = []
    if result['nav_height'] < 10:
        issues.append("Navigation height is too small")
    if result['nav_opacity'] != '1':
        issues.append(f"Navigation opacity is {result['nav_opacity']} (not fully opaque)")
    if not result['nav_sections_display'] or result['nav_sections_display'] == 'none':
        issues.append("Nav sections are hidden")
    if result['links_count'] < 3:
        issues.append("Too few navigation links found")
    
    if issues:
        print("\\n⚠️  POTENTIAL ISSUES:")
        for issue in issues:
            print(f"  • {issue}")
    else:
        print("\\n✅ Navigation appears to be rendering correctly")

if __name__ == "__main__":
    asyncio.run(main())