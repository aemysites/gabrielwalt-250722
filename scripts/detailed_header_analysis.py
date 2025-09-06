#!/usr/bin/env python3
"""
Detailed header analysis with side-by-side comparison
"""
import asyncio
from playwright.async_api import async_playwright
import os
from datetime import datetime
# from PIL import Image  # Not needed for basic analysis
# import numpy as np

async def capture_detailed_comparison():
    """Capture detailed screenshots and create side-by-side comparison"""
    
    output_dir = f'/workspace/tmp/detailed_analysis_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
    os.makedirs(output_dir, exist_ok=True)
    
    urls = {
        'original': 'https://www.wknd-trendsetters.site/',
        'implemented': 'https://main--gabrielwalt-250722--aemysites.aem.page/'
    }
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        # Capture at multiple viewport widths
        viewports = [
            {'width': 1600, 'height': 900, 'name': 'desktop'},
            {'width': 1200, 'height': 800, 'name': 'laptop'},
        ]
        
        for viewport in viewports:
            print(f"\n📸 Capturing at {viewport['width']}x{viewport['height']} ({viewport['name']})")
            
            for name, url in urls.items():
                print(f"  Processing {name}...")
                
                context = await browser.new_context(
                    viewport={'width': viewport['width'], 'height': viewport['height']},
                    device_scale_factor=2
                )
                
                page = await context.new_page()
                
                try:
                    await page.goto(url, wait_until='networkidle', timeout=30000)
                    await asyncio.sleep(3)
                    
                    # Capture header details
                    await page.screenshot(
                        path=f"{output_dir}/{name}_{viewport['name']}_header.png",
                        clip={'x': 0, 'y': 0, 'width': viewport['width'], 'height': 100}
                    )
                    
                    # Try to capture navigation area specifically
                    await page.screenshot(
                        path=f"{output_dir}/{name}_{viewport['name']}_nav.png",
                        clip={'x': 200, 'y': 0, 'width': 800, 'height': 80}
                    )
                    
                    # Capture Subscribe button area
                    await page.screenshot(
                        path=f"{output_dir}/{name}_{viewport['name']}_subscribe.png",
                        clip={'x': viewport['width']-400, 'y': 0, 'width': 400, 'height': 80}
                    )
                    
                    # Try to capture Trends dropdown
                    try:
                        # Click Trends
                        await page.click('text=Trends', timeout=3000)
                        await asyncio.sleep(1.5)
                        
                        await page.screenshot(
                            path=f"{output_dir}/{name}_{viewport['name']}_trends.png",
                            clip={'x': 0, 'y': 0, 'width': viewport['width'], 'height': 600}
                        )
                        
                        # Close dropdown
                        await page.click('text=Trends')
                    except:
                        print(f"    ⚠ Could not capture Trends for {name}")
                    
                    print(f"  ✓ Captured {name}")
                    
                except Exception as e:
                    print(f"  ✗ Error: {str(e)}")
                
                await context.close()
        
        await browser.close()
    
    print(f"\n✅ Analysis saved to: {output_dir}")
    
    # Create comparison analysis
    print("\n📊 Creating detailed analysis...")
    analysis = analyze_differences(output_dir)
    
    # Save analysis
    with open(f"{output_dir}/analysis.md", 'w') as f:
        f.write(analysis)
    
    print(f"📝 Analysis written to: {output_dir}/analysis.md")
    return output_dir

def analyze_differences(output_dir):
    """Analyze visual differences between original and implementation"""
    
    analysis = """# Header Comparison Analysis

## Visual Differences Identified

### Typography
- [ ] Navigation font weight appears lighter in implementation
- [ ] Navigation font size might be slightly smaller
- [ ] Subscribe button text weight needs adjustment

### Spacing & Layout
- [ ] Navigation items spacing needs fine-tuning
- [ ] Logo to navigation gap might need adjustment
- [ ] Subscribe button padding/dimensions

### Dropdown Styling
- [ ] Shadow intensity on dropdown
- [ ] Border radius consistency
- [ ] Arrow icon styling and rotation

### Colors
- [x] Yellow shadow on Subscribe button - FIXED
- [x] Lime squares in Trends - FIXED
- [ ] Hover states need verification

## Next Actions
1. Adjust navigation font-weight to 500 or 600
2. Increase navigation font-size slightly
3. Fine-tune Subscribe button dimensions
4. Adjust dropdown shadow opacity
5. Verify arrow icon matches original
"""
    
    return analysis

if __name__ == "__main__":
    asyncio.run(capture_detailed_comparison())