#!/usr/bin/env python3
"""
Advanced visual analysis tool for precise UI comparison
Captures high-resolution elements, extracts styles, creates annotated comparisons
"""
import asyncio
from playwright.async_api import async_playwright
import os
import json
from datetime import datetime

class VisualAnalyzer:
    def __init__(self):
        self.output_dir = f'/workspace/tmp/visual_analysis_{datetime.now().strftime("%Y%m%d_%H%M%S")}'
        os.makedirs(self.output_dir, exist_ok=True)
        
    async def analyze_sites(self):
        """Perform detailed visual analysis of both sites"""
        sites = {
            'original': 'https://www.wknd-trendsetters.site/',
            'implemented': 'https://main--gabrielwalt-250722--aemysites.aem.page/'
        }
        
        results = {}
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            
            for site_name, url in sites.items():
                print(f"\n🔍 Analyzing {site_name}: {url}")
                results[site_name] = await self.analyze_site(browser, site_name, url)
            
            await browser.close()
        
        # Create comparison report
        await self.create_comparison_report(results)
        
        return results
    
    async def analyze_site(self, browser, site_name, url):
        """Analyze a single site in detail"""
        context = await browser.new_context(
            viewport={'width': 1600, 'height': 900},
            device_scale_factor=2
        )
        
        page = await context.new_page()
        
        try:
            await page.goto(url, wait_until='networkidle', timeout=30000)
            await asyncio.sleep(2)
            
            site_data = {
                'url': url,
                'header': await self.analyze_header(page, site_name),
                'trends_menu': await self.analyze_trends_menu(page, site_name),
                'support_menu': await self.analyze_support_menu(page, site_name)
            }
            
        except Exception as e:
            print(f"  ❌ Error analyzing {site_name}: {str(e)}")
            site_data = {'error': str(e)}
        
        await context.close()
        return site_data
    
    async def analyze_header(self, page, site_name):
        """Detailed analysis of header element"""
        print(f"  📏 Analyzing header...")
        
        try:
            # Capture header at high resolution
            header_element = page.locator('header')
            await header_element.screenshot(
                path=f'{self.output_dir}/{site_name}_header_detailed.png'
            )
            
            # Extract header styles and measurements
            header_data = await page.evaluate('''() => {
                const header = document.querySelector('header');
                const nav = document.querySelector('header nav');
                
                if (!header || !nav) return null;
                
                const headerStyles = window.getComputedStyle(header);
                const navStyles = window.getComputedStyle(nav);
                const navRect = nav.getBoundingClientRect();
                
                return {
                    header: {
                        background: headerStyles.backgroundColor,
                        height: headerStyles.height,
                        padding: headerStyles.padding,
                        position: headerStyles.position
                    },
                    nav: {
                        maxWidth: navStyles.maxWidth,
                        padding: navStyles.padding,
                        margin: navStyles.margin,
                        justifyContent: navStyles.justifyContent,
                        alignItems: navStyles.alignItems,
                        gap: navStyles.gap,
                        actualWidth: navRect.width,
                        actualHeight: navRect.height,
                        leftOffset: navRect.left,
                        rightOffset: window.innerWidth - navRect.right
                    }
                };
            }''')
            
            return header_data
            
        except Exception as e:
            print(f"    ⚠ Could not analyze header: {e}")
            return None
    
    async def analyze_trends_menu(self, page, site_name):
        """Detailed analysis of Trends dropdown"""
        print(f"  📋 Analyzing Trends menu...")
        
        try:
            # Open Trends menu
            trends_trigger = page.locator('nav a:has-text("Trends"), nav span:has-text("Trends"), nav .nav-drop:has-text("Trends")').first
            await trends_trigger.click()
            await asyncio.sleep(1)
            
            # Capture dropdown
            dropdown = page.locator('.nav-drop[aria-expanded="true"]').first
            await dropdown.screenshot(
                path=f'{self.output_dir}/{site_name}_trends_menu_detailed.png'
            )
            
            # Extract styles and content
            menu_data = await page.evaluate('''() => {
                const dropdown = document.querySelector('.nav-drop[aria-expanded="true"]');
                if (!dropdown) return null;
                
                const dropdownUl = dropdown.querySelector('ul');
                const dropdownStyles = window.getComputedStyle(dropdownUl);
                const rect = dropdownUl.getBoundingClientRect();
                
                // Analyze categories and items
                const categories = Array.from(dropdown.querySelectorAll('li')).map((li, index) => {
                    const header = li.querySelector('strong, p');
                    const items = Array.from(li.querySelectorAll('ul li a')).map(a => ({
                        text: a.textContent.trim(),
                        color: window.getComputedStyle(a).color,
                        fontSize: window.getComputedStyle(a).fontSize,
                        fontWeight: window.getComputedStyle(a).fontWeight,
                        textTransform: window.getComputedStyle(a).textTransform,
                        letterSpacing: window.getComputedStyle(a).letterSpacing
                    }));
                    
                    return {
                        index,
                        header: header ? {
                            text: header.textContent.trim(),
                            color: window.getComputedStyle(header).color,
                            fontSize: window.getComputedStyle(header).fontSize,
                            fontWeight: window.getComputedStyle(header).fontWeight,
                            textTransform: window.getComputedStyle(header).textTransform,
                            letterSpacing: window.getComputedStyle(header).letterSpacing
                        } : null,
                        items: items
                    };
                });
                
                return {
                    container: {
                        width: dropdownStyles.width,
                        padding: dropdownStyles.padding,
                        backgroundColor: dropdownStyles.backgroundColor,
                        borderRadius: dropdownStyles.borderRadius,
                        boxShadow: dropdownStyles.boxShadow,
                        position: dropdownStyles.position,
                        left: dropdownStyles.left,
                        top: dropdownStyles.top,
                        transform: dropdownStyles.transform,
                        actualWidth: rect.width,
                        actualLeft: rect.left,
                        actualRight: rect.right
                    },
                    categories: categories
                };
            }''')
            
            return menu_data
            
        except Exception as e:
            print(f"    ⚠ Could not analyze Trends menu: {e}")
            return None
    
    async def analyze_support_menu(self, page, site_name):
        """Detailed analysis of Support dropdown"""
        print(f"  🛠 Analyzing Support menu...")
        
        try:
            # Close any open menus first
            await page.click('body')
            await asyncio.sleep(0.5)
            
            # Open Support menu
            support_trigger = page.locator('nav a:has-text("Support"), nav span:has-text("Support"), nav .nav-drop:has-text("Support")').first
            await support_trigger.click()
            await asyncio.sleep(1)
            
            # Capture dropdown
            dropdown = page.locator('.nav-drop[aria-expanded="true"]').first
            await dropdown.screenshot(
                path=f'{self.output_dir}/{site_name}_support_menu_detailed.png'
            )
            
            # Extract styles and content
            menu_data = await page.evaluate('''() => {
                const dropdown = document.querySelector('.nav-drop[aria-expanded="true"]');
                if (!dropdown) return null;
                
                const dropdownUl = dropdown.querySelector('ul');
                const dropdownStyles = window.getComputedStyle(dropdownUl);
                const rect = dropdownUl.getBoundingClientRect();
                
                const items = Array.from(dropdown.querySelectorAll('ul li a')).map(a => ({
                    text: a.textContent.trim(),
                    color: window.getComputedStyle(a).color,
                    fontSize: window.getComputedStyle(a).fontSize,
                    fontWeight: window.getComputedStyle(a).fontWeight
                }));
                
                return {
                    container: {
                        width: dropdownStyles.width,
                        padding: dropdownStyles.padding,
                        backgroundColor: dropdownStyles.backgroundColor,
                        borderRadius: dropdownStyles.borderRadius,
                        boxShadow: dropdownStyles.boxShadow,
                        actualWidth: rect.width,
                        actualLeft: rect.left
                    },
                    items: items
                };
            }''')
            
            return menu_data
            
        except Exception as e:
            print(f"    ⚠ Could not analyze Support menu: {e}")
            return None
    
    async def create_comparison_report(self, results):
        """Create detailed comparison report"""
        print(f"\n📊 Creating comparison report...")
        
        # Save raw data
        with open(f'{self.output_dir}/analysis_data.json', 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        # Create markdown report
        report = self.generate_markdown_report(results)
        with open(f'{self.output_dir}/comparison_report.md', 'w') as f:
            f.write(report)
        
        print(f"✅ Analysis complete! Results saved to: {self.output_dir}")
    
    def generate_markdown_report(self, results):
        """Generate detailed markdown comparison report"""
        report = f"""# Visual Analysis Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Header Analysis

### Original vs Implemented Comparison

"""
        
        if 'original' in results and 'implemented' in results:
            orig = results['original']
            impl = results['implemented']
            
            # Header comparison
            if orig.get('header') and impl.get('header'):
                report += "#### Navigation Container:\n"
                orig_nav = orig['header']['nav']
                impl_nav = impl['header']['nav']
                
                report += f"- **Max Width**: Original: `{orig_nav.get('maxWidth', 'N/A')}` | Implemented: `{impl_nav.get('maxWidth', 'N/A')}`\n"
                report += f"- **Actual Width**: Original: `{orig_nav.get('actualWidth', 'N/A')}px` | Implemented: `{impl_nav.get('actualWidth', 'N/A')}px`\n"
                report += f"- **Left Offset**: Original: `{orig_nav.get('leftOffset', 'N/A')}px` | Implemented: `{impl_nav.get('leftOffset', 'N/A')}px`\n"
                report += f"- **Right Offset**: Original: `{orig_nav.get('rightOffset', 'N/A')}px` | Implemented: `{impl_nav.get('rightOffset', 'N/A')}px`\n"
                report += f"- **Padding**: Original: `{orig_nav.get('padding', 'N/A')}` | Implemented: `{impl_nav.get('padding', 'N/A')}`\n\n"
            
            # Trends menu comparison
            if orig.get('trends_menu') and impl.get('trends_menu'):
                report += "## Trends Menu Analysis\n\n"
                orig_trends = orig['trends_menu']
                impl_trends = impl['trends_menu']
                
                if orig_trends and impl_trends:
                    report += "#### Container Styles:\n"
                    orig_container = orig_trends['container']
                    impl_container = impl_trends['container']
                    
                    report += f"- **Width**: Original: `{orig_container.get('width', 'N/A')}` | Implemented: `{impl_container.get('width', 'N/A')}`\n"
                    report += f"- **Padding**: Original: `{orig_container.get('padding', 'N/A')}` | Implemented: `{impl_container.get('padding', 'N/A')}`\n"
                    report += f"- **Border Radius**: Original: `{orig_container.get('borderRadius', 'N/A')}` | Implemented: `{impl_container.get('borderRadius', 'N/A')}`\n"
                    report += f"- **Position**: Original: `{orig_container.get('left', 'N/A')}` | Implemented: `{impl_container.get('left', 'N/A')}`\n\n"
                    
                    # Category analysis
                    report += "#### Category Headers:\n"
                    for i, (orig_cat, impl_cat) in enumerate(zip(orig_trends.get('categories', []), impl_trends.get('categories', []))):
                        if orig_cat.get('header') and impl_cat.get('header'):
                            report += f"**Category {i+1}:**\n"
                            report += f"- Text: Original: `{orig_cat['header']['text']}` | Implemented: `{impl_cat['header']['text']}`\n"
                            report += f"- Font Size: Original: `{orig_cat['header']['fontSize']}` | Implemented: `{impl_cat['header']['fontSize']}`\n"
                            report += f"- Font Weight: Original: `{orig_cat['header']['fontWeight']}` | Implemented: `{impl_cat['header']['fontWeight']}`\n"
                            report += f"- Text Transform: Original: `{orig_cat['header']['textTransform']}` | Implemented: `{impl_cat['header']['textTransform']}`\n"
                            report += f"- Color: Original: `{orig_cat['header']['color']}` | Implemented: `{impl_cat['header']['color']}`\n\n"
        
        report += "\n## Key Issues Identified:\n\n"
        report += "1. **Header placement and centering**\n"
        report += "2. **Navigation spacing and alignment**\n"
        report += "3. **Dropdown positioning and sizing**\n"
        report += "4. **Typography differences (sizes, weights, colors)**\n"
        report += "5. **Text transformation inconsistencies**\n"
        
        return report

async def main():
    analyzer = VisualAnalyzer()
    await analyzer.analyze_sites()

if __name__ == "__main__":
    asyncio.run(main())