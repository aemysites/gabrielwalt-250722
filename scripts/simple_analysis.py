#!/usr/bin/env python3
"""
Simple site analysis
"""
import asyncio
from playwright.async_api import async_playwright

async def simple_analysis():
    """Simple analysis of both sites"""
    
    sites = {
        'original': 'https://www.wknd-trendsetters.site/',
        'implemented': 'https://main--gabrielwalt-250722--aemysites.aem.page/'
    }
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        for site_name, url in sites.items():
            print(f"\n🔍 Analyzing {site_name}: {url}")
            
            context = await browser.new_context(viewport={'width': 1600, 'height': 900})
            page = await context.new_page()
            
            try:
                await page.goto(url, wait_until='networkidle', timeout=30000)
                await asyncio.sleep(3)
                
                # Simple checks
                checks = await page.evaluate('''() => {
                    return {
                        title: document.title,
                        hasNavigation: document.querySelector('nav') ? 'Found' : 'Not found',
                        bodyText: document.body.textContent.substring(0, 300).replace(/\\s+/g, ' '),
                        navText: document.querySelector('nav')?.textContent.substring(0, 200) || 'No nav'
                    };
                }''')
                
                print(f"  📄 Title: {checks['title']}")
                print(f"  🧭 Navigation: {checks['hasNavigation']}")
                print(f"  📝 Nav Text: {checks['navText']}")
                print(f"  📄 Body preview: {checks['bodyText'][:150]}...")
                
            except Exception as e:
                print(f"  ❌ Error: {e}")
            
            await context.close()
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(simple_analysis())