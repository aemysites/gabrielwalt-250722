#!/usr/bin/env python3
"""
Capture header menu screenshots for visual comparison
"""
import asyncio
from playwright.async_api import async_playwright
import os
from datetime import datetime

async def capture_header_screenshots():
    """Capture screenshots of both original and EDS implementation"""
    
    # URLs to compare
    urls = {
        'original': 'https://www.wknd-trendsetters.site/',
        'implemented': 'https://main--gabrielwalt-250722--aemysites.aem.page/'
    }
    
    # Create output directory
    output_dir = f'/workspace/tmp/header_comparison_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
    os.makedirs(output_dir, exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        for name, url in urls.items():
            print(f"\nCapturing {name} site: {url}")
            
            context = await browser.new_context(
                viewport={'width': 1600, 'height': 900},
                device_scale_factor=2  # High resolution
            )
            
            page = await context.new_page()
            
            try:
                # Navigate to page
                await page.goto(url, wait_until='networkidle', timeout=30000)
                await asyncio.sleep(2)  # Wait for animations
                
                # Capture full header
                await page.screenshot(
                    path=f'{output_dir}/{name}_header_closed.png',
                    clip={'x': 0, 'y': 0, 'width': 1600, 'height': 150}
                )
                print(f"  ✓ Captured header (closed)")
                
                # Try to open Trends dropdown
                trends_selector = 'nav a:has-text("Trends"), nav span:has-text("Trends"), nav .nav-drop:has-text("Trends")'
                try:
                    await page.click(trends_selector, timeout=5000)
                    await asyncio.sleep(1)  # Wait for animation
                    
                    # Capture with Trends open
                    await page.screenshot(
                        path=f'{output_dir}/{name}_trends_open.png',
                        clip={'x': 0, 'y': 0, 'width': 1600, 'height': 600}
                    )
                    print(f"  ✓ Captured Trends dropdown")
                    
                    # Close Trends
                    await page.click(trends_selector)
                    await asyncio.sleep(0.5)
                except:
                    print(f"  ⚠ Could not capture Trends dropdown")
                
                # Try to open Support dropdown
                support_selector = 'nav a:has-text("Support"), nav span:has-text("Support"), nav .nav-drop:has-text("Support")'
                try:
                    await page.click(support_selector, timeout=5000)
                    await asyncio.sleep(1)  # Wait for animation
                    
                    # Capture with Support open
                    await page.screenshot(
                        path=f'{output_dir}/{name}_support_open.png',
                        clip={'x': 0, 'y': 0, 'width': 1600, 'height': 400}
                    )
                    print(f"  ✓ Captured Support dropdown")
                except:
                    print(f"  ⚠ Could not capture Support dropdown")
                
                # Capture Subscribe button area
                try:
                    # Focus on the right side of the header
                    await page.screenshot(
                        path=f'{output_dir}/{name}_subscribe_area.png',
                        clip={'x': 1200, 'y': 0, 'width': 400, 'height': 100}
                    )
                    print(f"  ✓ Captured Subscribe button area")
                except:
                    print(f"  ⚠ Could not capture Subscribe area")
                    
            except Exception as e:
                print(f"  ✗ Error capturing {name}: {str(e)}")
            
            await context.close()
        
        await browser.close()
    
    print(f"\n✅ Screenshots saved to: {output_dir}")
    print("\nNext steps:")
    print("1. Compare the screenshots to identify differences")
    print("2. Focus on fixing the most visible issues first")
    print("3. Iterate and re-capture after each fix")
    
    return output_dir

if __name__ == "__main__":
    asyncio.run(capture_header_screenshots())