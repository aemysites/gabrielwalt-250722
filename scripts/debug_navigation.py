#!/usr/bin/env python3
"""
Debug Navigation Structure
"""
import asyncio
from playwright.async_api import async_playwright

async def debug_navigation():
    """Debug the navigation structure on both sites"""
    
    sites = {
        'original': 'https://www.wknd-trendsetters.site/',
        'implemented': 'https://main--gabrielwalt-250722--aemysites.aem.page/'
    }
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        for site_name, url in sites.items():
            print(f"\n🔍 Debugging {site_name}: {url}")
            
            context = await browser.new_context(viewport={'width': 1600, 'height': 900})
            page = await context.new_page()
            
            try:
                await page.goto(url, wait_until='networkidle', timeout=30000)
                await asyncio.sleep(2)
                
                # Debug nav structure
                nav_structure = await page.evaluate('''() => {
                    const nav = document.querySelector('header nav');
                    if (!nav) return { error: 'No nav found' };
                    
                    // Find all top-level nav items
                    const navSections = document.querySelector('.nav-sections');
                    const mainNavItems = [];
                    
                    if (navSections) {
                        const links = navSections.querySelectorAll('ul > li > a, ul > li > span');
                        links.forEach(link => {
                            const parent = link.parentElement;
                            const hasDropdown = parent.classList.contains('nav-drop');
                            
                            mainNavItems.push({
                                text: link.textContent.trim(),
                                hasDropdown: hasDropdown,
                                classes: Array.from(parent.classList),
                                expanded: parent.getAttribute('aria-expanded') === 'true'
                            });
                        });
                    }
                    
                    return {
                        totalNavItems: mainNavItems.length,
                        items: mainNavItems,
                        navSectionsHTML: navSections ? navSections.innerHTML.substring(0, 500) : 'No nav-sections'
                    };
                }''')
                
                print(f"  📋 Navigation Structure:")
                print(f"    Total Items: {nav_structure.get('totalNavItems', 0)}")
                
                for item in nav_structure.get('items', []):
                    status = "🔽" if item['hasDropdown'] else "📄"
                    expanded = " [EXPANDED]" if item['expanded'] else ""
                    print(f"    {status} {item['text']}{expanded}")
                
                # Check for any always-expanded dropdowns
                always_expanded = await page.evaluate('''() => {
                    const expandedDropdowns = document.querySelectorAll('.nav-drop[aria-expanded="true"]');
                    return Array.from(expandedDropdowns).map(dropdown => ({
                        text: dropdown.textContent.substring(0, 50).trim(),
                        classList: Array.from(dropdown.classList)
                    }));
                }''')
                
                if always_expanded:
                    print(f"  ⚠ Always expanded dropdowns found:")
                    for dropdown in always_expanded:
                        print(f"    - {dropdown['text']}...")
                
            except Exception as e:
                print(f"  ❌ Error: {e}")
            
            await context.close()
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_navigation())