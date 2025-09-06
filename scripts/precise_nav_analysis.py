#!/usr/bin/env python3
"""
Precise Navigation Analysis - Check main nav items specifically
"""
import asyncio
from playwright.async_api import async_playwright

async def analyze_main_navigation():
    """Analyze main navigation items specifically"""
    
    url = 'https://main--gabrielwalt-250722--aemysites.aem.page/'
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1600, 'height': 900})
        page = await context.new_page()
        
        try:
            await page.goto(url, wait_until='networkidle', timeout=30000)
            await asyncio.sleep(3)
            
            # Get main navigation items specifically
            main_nav_analysis = await page.evaluate('''() => {
                // Get the main navigation links (not dropdown content)
                const mainNavLinks = document.querySelectorAll('.nav-sections > .default-content-wrapper > ul > li > a, .nav-sections > .default-content-wrapper > ul > li > span');
                
                const mainNavItems = Array.from(mainNavLinks).map(link => {
                    const styles = window.getComputedStyle(link);
                    return {
                        text: link.textContent.trim(),
                        fontSize: styles.fontSize,
                        fontWeight: styles.fontWeight,
                        letterSpacing: styles.letterSpacing,
                        color: styles.color,
                        tagName: link.tagName.toLowerCase()
                    };
                });
                
                return {
                    mainNavItems: mainNavItems,
                    count: mainNavItems.length
                };
            }''')
            
            print(f"🔍 Main Navigation Analysis:")
            print(f"  📊 Found {main_nav_analysis['count']} main nav items")
            
            for item in main_nav_analysis['mainNavItems']:
                print(f"  📝 {item['text']} ({item['tagName']}): {item['fontSize']} / {item['fontWeight']} / {item['letterSpacing']}")
            
            return main_nav_analysis
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return None
        
        finally:
            await context.close()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(analyze_main_navigation())