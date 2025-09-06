#!/usr/bin/env python3
"""
Examine HTML structure of both sites
"""
import asyncio
from playwright.async_api import async_playwright

async def examine_html():
    """Examine the raw HTML structure"""
    
    sites = {
        'original': 'https://www.wknd-trendsetters.site/',
        'implemented': 'https://main--gabrielwalt-250722--aemysites.aem.page/'
    }
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        for site_name, url in sites.items():
            print(f"\n🔍 Examining {site_name}: {url}")
            
            context = await browser.new_context(viewport={'width': 1600, 'height': 900})
            page = await context.new_page()
            
            try:
                await page.goto(url, wait_until='networkidle', timeout=30000)
                await asyncio.sleep(3)
                
                # Get header HTML
                header_html = await page.evaluate('''() => {
                    const header = document.querySelector('header');
                    return header ? header.innerHTML : 'No header found';
                }''')
                
                print(f"  📝 Header HTML (first 800 chars):")
                print(f"    {header_html[:800]}...")
                
                # Check for specific navigation selectors
                nav_checks = await page.evaluate('''() => {
                    return {
                        hasHeader: !!document.querySelector('header'),
                        hasNav: !!document.querySelector('nav'),
                        hasNavSections: !!document.querySelector('.nav-sections'),
                        trendsSelector: !!document.querySelector('nav a:has-text("Trends"), nav span:has-text("Trends")'),
                        trendsText: document.querySelector('nav')?.textContent.includes('Trends'),
                        allNavText: document.querySelector('nav')?.textContent.substring(0, 200)
                    };
                }''')
                
                print(f"  🔍 Navigation Elements:")
                for key, value in nav_checks.items():
                    print(f"    {key}: {value}")
                
            except Exception as e:
                print(f"  ❌ Error: {e}")
            
            await context.close()
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(examine_html())