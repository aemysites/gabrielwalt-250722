#!/usr/bin/env python3
"""
Advanced Visual Difference Analysis Tool
Uses ODiff + ImageMagick + Playwright for pixel-perfect UI comparison
"""
import asyncio
from playwright.async_api import async_playwright
import subprocess
import os
import json
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import tempfile

class AdvancedVisualDiff:
    def __init__(self):
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.output_dir = f'/workspace/tmp/visual_diff_{self.timestamp}'
        os.makedirs(self.output_dir, exist_ok=True)
        
        self.sites = {
            'original': 'https://www.wknd-trendsetters.site/',
            'implemented': 'https://main--gabrielwalt-250722--aemysites.aem.page/'
        }
        
        print(f"🔍 Advanced Visual Analysis initialized")
        print(f"📁 Output directory: {self.output_dir}")
    
    async def run_full_analysis(self):
        """Run complete visual analysis workflow"""
        print(f"\n🚀 Starting comprehensive visual analysis...")
        
        # Step 1: Capture high-resolution screenshots
        screenshots = await self.capture_high_res_screenshots()
        
        # Step 2: Generate pixel-perfect diffs
        if screenshots:
            await self.generate_pixel_diffs(screenshots)
            
            # Step 3: Extract and compare styles
            styles = await self.extract_computed_styles()
            
            # Step 4: Create annotated analysis
            await self.create_annotated_analysis(screenshots, styles)
            
            # Step 5: Generate actionable report
            self.generate_action_report(screenshots, styles)
        
        return self.output_dir
    
    async def capture_high_res_screenshots(self):
        """Capture ultra high-resolution screenshots of key elements"""
        print(f"\n📸 Capturing high-resolution screenshots...")
        
        screenshots = {}
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            
            for site_name, url in self.sites.items():
                print(f"  📷 Capturing {site_name}...")
                
                context = await browser.new_context(
                    viewport={'width': 1600, 'height': 900},
                    device_scale_factor=3  # Ultra high DPI
                )
                
                page = await context.new_page()
                
                try:
                    await page.goto(url, wait_until='networkidle', timeout=30000)
                    await asyncio.sleep(3)
                    
                    # Capture full header with precise cropping
                    header_path = f'{self.output_dir}/{site_name}_header_4k.png'
                    await page.screenshot(
                        path=header_path,
                        clip={'x': 0, 'y': 0, 'width': 1600, 'height': 120}
                    )
                    
                    # Capture Trends dropdown
                    try:
                        trends_trigger = page.locator('nav a:has-text("Trends"), nav span:has-text("Trends")').first
                        await trends_trigger.click()
                        await asyncio.sleep(1.5)
                        
                        trends_path = f'{self.output_dir}/{site_name}_trends_4k.png'
                        await page.screenshot(
                            path=trends_path,
                            clip={'x': 0, 'y': 0, 'width': 1600, 'height': 600}
                        )
                        
                        # Close dropdown
                        await page.click('body')
                        await asyncio.sleep(0.5)
                        
                    except Exception as e:
                        print(f"    ⚠ Could not capture Trends for {site_name}: {e}")
                        trends_path = None
                    
                    # Capture Support dropdown
                    try:
                        support_trigger = page.locator('nav a:has-text("Support"), nav span:has-text("Support")').first
                        await support_trigger.click()
                        await asyncio.sleep(1)
                        
                        support_path = f'{self.output_dir}/{site_name}_support_4k.png'
                        await page.screenshot(
                            path=support_path,
                            clip={'x': 0, 'y': 0, 'width': 1600, 'height': 400}
                        )
                        
                    except Exception as e:
                        print(f"    ⚠ Could not capture Support for {site_name}: {e}")
                        support_path = None
                    
                    screenshots[site_name] = {
                        'header': header_path,
                        'trends': trends_path,
                        'support': support_path
                    }
                    
                    print(f"    ✅ {site_name} screenshots captured")
                    
                except Exception as e:
                    print(f"    ❌ Error capturing {site_name}: {e}")
                    screenshots[site_name] = None
                
                await context.close()
            
            await browser.close()
        
        return screenshots
    
    async def generate_pixel_diffs(self, screenshots):
        """Generate pixel-perfect difference maps using ODiff"""
        print(f"\n🎯 Generating pixel-perfect difference maps...")
        
        if not screenshots.get('original') or not screenshots.get('implemented'):
            print("  ❌ Missing screenshots for comparison")
            return
        
        comparisons = ['header', 'trends', 'support']
        
        for comp_type in comparisons:
            orig_path = screenshots['original'].get(comp_type)
            impl_path = screenshots['implemented'].get(comp_type)
            
            if not orig_path or not impl_path or not os.path.exists(orig_path) or not os.path.exists(impl_path):
                print(f"  ⚠ Skipping {comp_type} - missing images")
                continue
            
            print(f"  🔍 Analyzing {comp_type} differences...")
            
            # Generate ODiff comparison
            diff_path = f'{self.output_dir}/{comp_type}_odiff.png'
            
            try:
                result = subprocess.run([
                    'odiff',
                    orig_path,
                    impl_path,
                    diff_path,
                    '--threshold', '0.01',  # Very sensitive
                    '--diff-color', '#ff0000',  # Red for differences
                    '--output-diff-mask'
                ], capture_output=True, text=True, timeout=30)
                
                if result.returncode == 0:
                    print(f"    ✅ {comp_type} ODiff completed - IDENTICAL")
                elif result.returncode == 21:  # Different images
                    print(f"    🔥 {comp_type} ODiff completed - DIFFERENCES FOUND")
                    print(f"    📊 Diff saved: {diff_path}")
                else:
                    print(f"    ⚠ {comp_type} ODiff issue: {result.stderr}")
                
            except subprocess.TimeoutExpired:
                print(f"    ⏱ {comp_type} ODiff timed out")
            except Exception as e:
                print(f"    ❌ {comp_type} ODiff error: {e}")
            
            # Also generate ImageMagick comparison for different perspective
            im_diff_path = f'{self.output_dir}/{comp_type}_imagemagick.png'
            
            try:
                subprocess.run([
                    'compare',
                    '-metric', 'AE',
                    '-highlight-color', 'red',
                    orig_path,
                    impl_path,
                    im_diff_path
                ], capture_output=True, timeout=30)
                
                print(f"    ✅ {comp_type} ImageMagick comparison saved")
                
            except Exception as e:
                print(f"    ⚠ {comp_type} ImageMagick error: {e}")
    
    async def extract_computed_styles(self):
        """Extract detailed computed styles for comparison"""
        print(f"\n🎨 Extracting computed styles...")
        
        styles = {}
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            
            for site_name, url in self.sites.items():
                print(f"  🎯 Analyzing {site_name} styles...")
                
                context = await browser.new_context(
                    viewport={'width': 1600, 'height': 900}
                )
                
                page = await context.new_page()
                
                try:
                    await page.goto(url, wait_until='networkidle', timeout=30000)
                    await asyncio.sleep(2)
                    
                    # Extract comprehensive style data
                    site_styles = await page.evaluate('''() => {
                        const data = {};
                        
                        // Header container analysis
                        const header = document.querySelector('header');
                        const nav = document.querySelector('header nav');
                        
                        if (header && nav) {
                            const headerRect = header.getBoundingClientRect();
                            const navRect = nav.getBoundingClientRect();
                            const navStyles = window.getComputedStyle(nav);
                            
                            data.header = {
                                container: {
                                    width: navRect.width,
                                    height: navRect.height,
                                    left: navRect.left,
                                    right: navRect.right,
                                    centerX: navRect.left + navRect.width / 2,
                                    viewportCenter: window.innerWidth / 2,
                                    offsetFromCenter: (navRect.left + navRect.width / 2) - (window.innerWidth / 2)
                                },
                                styles: {
                                    maxWidth: navStyles.maxWidth,
                                    padding: navStyles.padding,
                                    paddingLeft: navStyles.paddingLeft,
                                    paddingRight: navStyles.paddingRight,
                                    margin: navStyles.margin,
                                    justifyContent: navStyles.justifyContent,
                                    gap: navStyles.gap,
                                    fontFamily: navStyles.fontFamily
                                }
                            };
                        }
                        
                        // Navigation items analysis
                        const navItems = Array.from(document.querySelectorAll('nav .nav-sections a')).map(a => {
                            const styles = window.getComputedStyle(a);
                            const rect = a.getBoundingClientRect();
                            return {
                                text: a.textContent.trim(),
                                fontSize: styles.fontSize,
                                fontWeight: styles.fontWeight,
                                letterSpacing: styles.letterSpacing,
                                color: styles.color,
                                width: rect.width,
                                paddingLeft: styles.paddingLeft,
                                paddingRight: styles.paddingRight
                            };
                        });
                        
                        data.navItems = navItems;
                        
                        // Dropdown arrows analysis
                        const dropdowns = Array.from(document.querySelectorAll('nav .nav-drop')).map(drop => {
                            const styles = window.getComputedStyle(drop, '::after');
                            return {
                                text: drop.textContent.trim(),
                                afterStyles: {
                                    marginLeft: styles.marginLeft,
                                    borderTopColor: styles.borderTopColor,
                                    borderWidth: styles.borderWidth,
                                    position: styles.position,
                                    top: styles.top
                                }
                            };
                        });
                        
                        data.dropdownArrows = dropdowns;
                        
                        // Subscribe button analysis
                        const subscribeBtn = document.querySelector('.nav-tools .button, .nav-tools a.button');
                        if (subscribeBtn) {
                            const btnStyles = window.getComputedStyle(subscribeBtn);
                            const btnRect = subscribeBtn.getBoundingClientRect();
                            
                            data.subscribeButton = {
                                position: {
                                    right: window.innerWidth - btnRect.right,
                                    width: btnRect.width,
                                    height: btnRect.height
                                },
                                styles: {
                                    padding: btnStyles.padding,
                                    fontSize: btnStyles.fontSize,
                                    fontWeight: btnStyles.fontWeight,
                                    borderWidth: btnStyles.borderWidth,
                                    borderRadius: btnStyles.borderRadius,
                                    boxShadow: btnStyles.boxShadow,
                                    letterSpacing: btnStyles.letterSpacing
                                }
                            };
                        }
                        
                        return data;
                    }''')
                    
                    styles[site_name] = site_styles
                    print(f"    ✅ {site_name} styles extracted")
                    
                except Exception as e:
                    print(f"    ❌ Error extracting {site_name} styles: {e}")
                    styles[site_name] = None
                
                await context.close()
            
            await browser.close()
        
        # Save styles data
        with open(f'{self.output_dir}/computed_styles.json', 'w') as f:
            json.dump(styles, f, indent=2, default=str)
        
        return styles
    
    def generate_action_report(self, screenshots, styles):
        """Generate actionable improvement report"""
        print(f"\n📊 Generating actionable report...")
        
        report = f"""# Advanced Visual Analysis Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Analysis Directory: {self.output_dir}

## 🎯 CRITICAL ISSUES IDENTIFIED

"""
        
        if styles and styles.get('original') and styles.get('implemented'):
            orig = styles['original']
            impl = styles['implemented']
            
            # Header positioning analysis
            if orig.get('header') and impl.get('header'):
                orig_header = orig['header']['container']
                impl_header = impl['header']['container']
                
                report += f"""### 1. HEADER POSITIONING ISSUES
**Original Header:**
- Width: {orig_header.get('width', 'N/A')}px
- Center Position: {orig_header.get('centerX', 'N/A')}px
- Offset from Viewport Center: {orig_header.get('offsetFromCenter', 'N/A')}px

**Implemented Header:**  
- Width: {impl_header.get('width', 'N/A')}px
- Center Position: {impl_header.get('centerX', 'N/A')}px
- Offset from Viewport Center: {impl_header.get('offsetFromCenter', 'N/A')}px

**📌 ACTION REQUIRED:**
"""
                
                orig_offset = orig_header.get('offsetFromCenter', 0)
                impl_offset = impl_header.get('offsetFromCenter', 0)
                
                if abs(orig_offset - impl_offset) > 10:
                    report += f"- Header centering is OFF by {abs(orig_offset - impl_offset):.1f}px\\n"
                    report += f"- Adjust max-width or padding to center properly\\n"
                
                # Max-width analysis
                orig_max_width = orig['header']['styles'].get('maxWidth', 'none')
                impl_max_width = impl['header']['styles'].get('maxWidth', 'none')
                
                if orig_max_width != impl_max_width:
                    report += f"- Max-width mismatch: Original=`{orig_max_width}` vs Implemented=`{impl_max_width}`\\n"
            
            # Navigation items analysis
            if orig.get('navItems') and impl.get('navItems'):
                report += f\"\\n### 2. NAVIGATION TYPOGRAPHY ISSUES\\n\"
                
                for i, (orig_item, impl_item) in enumerate(zip(orig['navItems'], impl['navItems'])):
                    if orig_item['fontSize'] != impl_item['fontSize']:
                        report += f"- {impl_item['text']}: Font size mismatch ({orig_item['fontSize']} vs {impl_item['fontSize']})\\n"
                    
                    if orig_item['fontWeight'] != impl_item['fontWeight']:
                        report += f"- {impl_item['text']}: Font weight mismatch ({orig_item['fontWeight']} vs {impl_item['fontWeight']})\\n"
                    
                    if orig_item['letterSpacing'] != impl_item['letterSpacing']:
                        report += f"- {impl_item['text']}: Letter spacing mismatch ({orig_item['letterSpacing']} vs {impl_item['letterSpacing']})\\n"
        
        report += f\"\\n## 🔍 GENERATED ANALYSIS FILES\\n\"
        report += f\"- **Pixel Diffs**: `*_odiff.png` and `*_imagemagick.png`\\n\"
        report += f\"- **High-res Screenshots**: `*_4k.png`\\n\"
        report += f\"- **Computed Styles**: `computed_styles.json`\\n\"
        
        report += f\"\\n## 🛠 RECOMMENDED FIXES\\n\"
        report += f\"1. **Header Centering**: Adjust nav max-width and centering\\n\"
        report += f\"2. **Typography**: Match font sizes, weights, and spacing exactly\\n\"
        report += f\"3. **Dropdown Positioning**: Fix mega-menu centering\\n\"
        report += f\"4. **Arrow Styling**: Refine dropdown arrow appearance\\n\"
        
        # Save report
        report_path = f'{self.output_dir}/ACTION_REPORT.md'
        with open(report_path, 'w') as f:
            f.write(report)
        
        print(f\"✅ Actionable report saved: {report_path}\")
        
        return report_path

async def main():
    analyzer = AdvancedVisualDiff()
    output_dir = await analyzer.run_full_analysis()
    
    print(f\"\\n🎉 ANALYSIS COMPLETE!\")
    print(f\"📁 Results: {output_dir}\")
    print(f\"📄 Check ACTION_REPORT.md for specific fixes\")

if __name__ == \"__main__\":
    asyncio.run(main())