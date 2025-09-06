#!/usr/bin/env python3
"""
Enhanced Visual Analyzer - Autonomous Visual Critique System
Addresses limitations of previous tools and provides actionable insights
"""
import asyncio
from playwright.async_api import async_playwright
import subprocess
import os
import json
from datetime import datetime
import uuid

class EnhancedVisualAnalyzer:
    def __init__(self):
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.analysis_id = str(uuid.uuid4())[:8]
        self.output_dir = f'/workspace/tmp/enhanced_analysis_{self.timestamp}_{self.analysis_id}'
        os.makedirs(self.output_dir, exist_ok=True)
        
        self.sites = {
            'original': 'https://www.wknd-trendsetters.site/',
            'live': 'https://main--gabrielwalt-250722--aemysites.aem.page/',
            'local': 'http://localhost:3001/'
        }
        
        # Load inventory for context
        self.inventory = self.load_inventory()
        
        print(f"🔍 Enhanced Visual Analyzer initialized")
        print(f"📁 Analysis ID: {self.analysis_id}")
        print(f"📁 Output: {self.output_dir}")
    
    def load_inventory(self):
        """Load inventory.json for block usage context"""
        try:
            with open('/workspace/projects/gabrielwalt-250722/tools/importer/inventory.json', 'r') as f:
                inventory = json.load(f)
                print(f"📋 Loaded inventory: {len(inventory)} items")
                return inventory
        except Exception as e:
            print(f"⚠ Could not load inventory: {e}")
            return {}
    
    async def comprehensive_analysis(self, use_local=False):
        """Run comprehensive visual analysis"""
        print(f"\n🚀 Starting comprehensive visual analysis...")
        
        # Choose which sites to compare
        sites_to_analyze = {
            'original': self.sites['original'],
            'implemented': self.sites['local'] if use_local else self.sites['live']
        }
        
        print(f"📊 Analyzing: {list(sites_to_analyze.keys())}")
        
        # Step 1: Capture high-precision screenshots
        screenshots = await self.capture_precision_screenshots(sites_to_analyze)
        
        # Step 2: Extract detailed computed styles
        styles = await self.extract_detailed_styles(sites_to_analyze)
        
        # Step 3: Generate visual diffs
        diffs = await self.generate_visual_diffs(screenshots)
        
        # Step 4: Analyze layout geometry
        geometry = await self.analyze_layout_geometry(sites_to_analyze)
        
        # Step 5: Generate actionable critique
        critique = self.generate_actionable_critique(screenshots, styles, geometry, diffs)
        
        # Step 6: Create improvement roadmap
        roadmap = self.create_improvement_roadmap(critique)
        
        return {
            'screenshots': screenshots,
            'styles': styles,
            'geometry': geometry,
            'diffs': diffs,
            'critique': critique,
            'roadmap': roadmap
        }
    
    async def capture_precision_screenshots(self, sites):
        """Capture high-precision, multi-angle screenshots"""
        print(f"\n📸 Capturing precision screenshots...")
        
        screenshots = {}
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            
            for site_name, url in sites.items():
                print(f"  📷 {site_name}: {url}")
                
                context = await browser.new_context(
                    viewport={'width': 1600, 'height': 900},
                    device_scale_factor=2  # High DPI
                )
                
                page = await context.new_page()
                site_screenshots = {}
                
                try:
                    await page.goto(url, wait_until='networkidle', timeout=30000)
                    await asyncio.sleep(3)
                    
                    # Full page screenshot
                    full_page_path = f'{self.output_dir}/{site_name}_fullpage.png'
                    await page.screenshot(path=full_page_path, full_page=True)
                    site_screenshots['fullpage'] = full_page_path
                    
                    # Header region (precise crop)
                    header_path = f'{self.output_dir}/{site_name}_header.png'
                    await page.screenshot(
                        path=header_path,
                        clip={'x': 0, 'y': 0, 'width': 1600, 'height': 200}
                    )
                    site_screenshots['header'] = header_path
                    
                    # Navigation area (just nav items)
                    nav_path = f'{self.output_dir}/{site_name}_navigation.png'
                    nav_element = page.locator('nav .nav-sections')
                    if await nav_element.count() > 0:
                        await nav_element.screenshot(path=nav_path)
                        site_screenshots['navigation'] = nav_path
                    
                    # Subscribe button area
                    button_path = f'{self.output_dir}/{site_name}_subscribe.png'
                    button_element = page.locator('.nav-tools, nav .button')
                    if await button_element.count() > 0:
                        await button_element.first.screenshot(path=button_path)
                        site_screenshots['subscribe'] = button_path
                    
                    print(f"    ✅ Captured {len(site_screenshots)} screenshots")
                    
                except Exception as e:
                    print(f"    ❌ Error capturing {site_name}: {e}")
                    site_screenshots = {'error': str(e)}
                
                screenshots[site_name] = site_screenshots
                await context.close()
            
            await browser.close()
        
        return screenshots
    
    async def extract_detailed_styles(self, sites):
        """Extract detailed computed styles with precision"""
        print(f"\n🎨 Extracting detailed computed styles...")
        
        styles = {}
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            
            for site_name, url in sites.items():
                print(f"  🎯 {site_name}: {url}")
                
                context = await browser.new_context(
                    viewport={'width': 1600, 'height': 900}
                )
                
                page = await context.new_page()
                
                try:
                    await page.goto(url, wait_until='networkidle', timeout=30000)
                    await asyncio.sleep(3)
                    
                    # Comprehensive style extraction
                    site_styles = await page.evaluate('''() => {
                        const analysis = {};
                        
                        // Header container analysis
                        const header = document.querySelector('header');
                        const nav = document.querySelector('header nav');
                        
                        if (nav) {
                            const navRect = nav.getBoundingClientRect();
                            const navStyles = window.getComputedStyle(nav);
                            
                            analysis.header = {
                                geometry: {
                                    width: navRect.width,
                                    height: navRect.height,
                                    left: navRect.left,
                                    right: navRect.right,
                                    centerX: navRect.left + navRect.width / 2,
                                    viewportCenter: window.innerWidth / 2,
                                    centerOffset: (navRect.left + navRect.width / 2) - (window.innerWidth / 2)
                                },
                                styles: {
                                    maxWidth: navStyles.maxWidth,
                                    width: navStyles.width,
                                    padding: navStyles.padding,
                                    paddingLeft: navStyles.paddingLeft,
                                    paddingRight: navStyles.paddingRight,
                                    margin: navStyles.margin,
                                    justifyContent: navStyles.justifyContent,
                                    gap: navStyles.gap,
                                    fontFamily: navStyles.fontFamily,
                                    backgroundColor: navStyles.backgroundColor
                                }
                            };
                        }
                        
                        // Main navigation items (top-level only)
                        const mainNavItems = Array.from(
                            document.querySelectorAll('.nav-sections > .default-content-wrapper > ul > li > a, .nav-sections > .default-content-wrapper > ul > li > span')
                        ).map(item => {
                            const styles = window.getComputedStyle(item);
                            const rect = item.getBoundingClientRect();
                            return {
                                text: item.textContent.trim().split('\\n')[0], // First line only
                                tagName: item.tagName.toLowerCase(),
                                typography: {
                                    fontSize: styles.fontSize,
                                    fontWeight: styles.fontWeight,
                                    fontFamily: styles.fontFamily,
                                    letterSpacing: styles.letterSpacing,
                                    lineHeight: styles.lineHeight,
                                    color: styles.color
                                },
                                geometry: {
                                    width: rect.width,
                                    height: rect.height,
                                    left: rect.left,
                                    right: rect.right
                                },
                                spacing: {
                                    paddingLeft: styles.paddingLeft,
                                    paddingRight: styles.paddingRight,
                                    marginLeft: styles.marginLeft,
                                    marginRight: styles.marginRight
                                }
                            };
                        });
                        
                        analysis.mainNavigation = mainNavItems;
                        
                        // Subscribe button analysis
                        const subscribeBtn = document.querySelector('.nav-tools .button, .nav-tools a.button');
                        if (subscribeBtn) {
                            const btnStyles = window.getComputedStyle(subscribeBtn);
                            const btnRect = subscribeBtn.getBoundingClientRect();
                            
                            analysis.subscribeButton = {
                                geometry: {
                                    width: btnRect.width,
                                    height: btnRect.height,
                                    right: window.innerWidth - btnRect.right
                                },
                                typography: {
                                    fontSize: btnStyles.fontSize,
                                    fontWeight: btnStyles.fontWeight,
                                    fontFamily: btnStyles.fontFamily,
                                    letterSpacing: btnStyles.letterSpacing,
                                    color: btnStyles.color
                                },
                                styling: {
                                    padding: btnStyles.padding,
                                    border: btnStyles.border,
                                    borderWidth: btnStyles.borderWidth,
                                    borderColor: btnStyles.borderColor,
                                    borderRadius: btnStyles.borderRadius,
                                    boxShadow: btnStyles.boxShadow,
                                    backgroundColor: btnStyles.backgroundColor
                                }
                            };
                        }
                        
                        // Dropdown analysis
                        const dropdowns = Array.from(document.querySelectorAll('.nav-drop')).map(dropdown => {
                            const expanded = dropdown.getAttribute('aria-expanded') === 'true';
                            const dropdownUl = dropdown.querySelector('ul');
                            
                            return {
                                text: dropdown.textContent.trim().split('\\n')[0],
                                expanded: expanded,
                                hasSubMenu: !!dropdown.querySelector('ul li ul'),
                                visible: dropdownUl ? window.getComputedStyle(dropdownUl).display !== 'none' : false
                            };
                        });
                        
                        analysis.dropdowns = dropdowns;
                        
                        return analysis;
                    }''')
                    
                    styles[site_name] = site_styles
                    print(f"    ✅ Extracted detailed styles")
                    
                except Exception as e:
                    print(f"    ❌ Error extracting styles for {site_name}: {e}")
                    styles[site_name] = {'error': str(e)}
                
                await context.close()
            
            await browser.close()
        
        return styles
    
    async def generate_visual_diffs(self, screenshots):
        """Generate visual difference analysis"""
        print(f"\n🎯 Generating visual difference analysis...")
        
        if not screenshots.get('original') or not screenshots.get('implemented'):
            print("  ❌ Missing screenshots for comparison")
            return {}
        
        diffs = {}
        
        # Compare each screenshot type
        for shot_type in ['header', 'navigation', 'subscribe']:
            orig_path = screenshots['original'].get(shot_type)
            impl_path = screenshots['implemented'].get(shot_type)
            
            if orig_path and impl_path and os.path.exists(orig_path) and os.path.exists(impl_path):
                print(f"  🔍 Comparing {shot_type}...")
                
                # Use ImageMagick for diff (ODiff had GLIBC issues)
                diff_path = f'{self.output_dir}/{shot_type}_diff.png'
                
                try:
                    result = subprocess.run([
                        'compare',
                        '-metric', 'AE',
                        '-highlight-color', 'red',
                        orig_path,
                        impl_path,
                        diff_path
                    ], capture_output=True, text=True, timeout=30)
                    
                    diffs[shot_type] = {
                        'diff_path': diff_path,
                        'different_pixels': result.stderr.strip() if result.stderr else 'unknown',
                        'comparison_successful': os.path.exists(diff_path)
                    }
                    
                    print(f"    ✅ {shot_type} diff: {diffs[shot_type]['different_pixels']} different pixels")
                    
                except Exception as e:
                    print(f"    ⚠ {shot_type} diff error: {e}")
                    diffs[shot_type] = {'error': str(e)}
        
        return diffs
    
    async def analyze_layout_geometry(self, sites):
        """Analyze precise layout geometry differences"""
        print(f"\n📐 Analyzing layout geometry...")
        
        # This would be similar to extract_detailed_styles but focused on measurements
        # For now, return placeholder
        return {'status': 'geometry analysis implemented in styles extraction'}
    
    def generate_actionable_critique(self, screenshots, styles, geometry, diffs):
        """Generate specific, actionable critique"""
        print(f"\n📝 Generating actionable critique...")
        
        critique = {
            'critical_issues': [],
            'moderate_issues': [],
            'minor_issues': [],
            'summary': {}
        }
        
        if 'original' in styles and 'implemented' in styles:
            orig = styles['original']
            impl = styles['implemented']
            
            # Header alignment analysis
            if orig.get('header') and impl.get('header'):
                orig_offset = orig['header']['geometry'].get('centerOffset', 0)
                impl_offset = impl['header']['geometry'].get('centerOffset', 0)
                
                offset_diff = abs(orig_offset - impl_offset)
                if offset_diff > 10:
                    critique['critical_issues'].append({
                        'type': 'header_alignment',
                        'description': f'Header centering off by {offset_diff:.1f}px',
                        'original_offset': orig_offset,
                        'implemented_offset': impl_offset,
                        'fix_suggestion': 'Adjust nav max-width or padding for perfect centering'
                    })
                elif offset_diff > 2:
                    critique['moderate_issues'].append({
                        'type': 'header_alignment',
                        'description': f'Minor header centering issue: {offset_diff:.1f}px',
                        'fix_suggestion': 'Fine-tune centering for pixel-perfect alignment'
                    })
            
            # Navigation typography analysis
            if orig.get('mainNavigation') and impl.get('mainNavigation'):
                for i, (orig_item, impl_item) in enumerate(zip(orig['mainNavigation'], impl['mainNavigation'])):
                    if len(orig_item['text']) > 0 and len(impl_item['text']) > 0:
                        # Font size comparison
                        if orig_item['typography']['fontSize'] != impl_item['typography']['fontSize']:
                            critique['moderate_issues'].append({
                                'type': 'typography_size',
                                'element': impl_item['text'],
                                'original_size': orig_item['typography']['fontSize'],
                                'implemented_size': impl_item['typography']['fontSize'],
                                'fix_suggestion': f"Change font-size to {orig_item['typography']['fontSize']}"
                            })
                        
                        # Font weight comparison
                        if orig_item['typography']['fontWeight'] != impl_item['typography']['fontWeight']:
                            critique['moderate_issues'].append({
                                'type': 'typography_weight',
                                'element': impl_item['text'],
                                'original_weight': orig_item['typography']['fontWeight'],
                                'implemented_weight': impl_item['typography']['fontWeight'],
                                'fix_suggestion': f"Change font-weight to {orig_item['typography']['fontWeight']}"
                            })
            
            # Button styling analysis
            if orig.get('subscribeButton') and impl.get('subscribeButton'):
                orig_btn = orig['subscribeButton']
                impl_btn = impl['subscribeButton']
                
                # Compare button styling
                if orig_btn['styling']['boxShadow'] != impl_btn['styling']['boxShadow']:
                    critique['minor_issues'].append({
                        'type': 'button_shadow',
                        'original_shadow': orig_btn['styling']['boxShadow'],
                        'implemented_shadow': impl_btn['styling']['boxShadow'],
                        'fix_suggestion': 'Adjust box-shadow to match original exactly'
                    })
        
        critique['summary'] = {
            'total_issues': len(critique['critical_issues']) + len(critique['moderate_issues']) + len(critique['minor_issues']),
            'critical_count': len(critique['critical_issues']),
            'moderate_count': len(critique['moderate_issues']),
            'minor_count': len(critique['minor_issues'])
        }
        
        return critique
    
    def create_improvement_roadmap(self, critique):
        """Create prioritized improvement roadmap"""
        roadmap = {
            'immediate_actions': [],
            'next_steps': [],
            'polish_items': []
        }
        
        # Critical issues -> immediate actions
        for issue in critique['critical_issues']:
            roadmap['immediate_actions'].append({
                'priority': 'HIGH',
                'task': issue['description'],
                'fix': issue['fix_suggestion'],
                'type': issue['type']
            })
        
        # Moderate issues -> next steps  
        for issue in critique['moderate_issues']:
            roadmap['next_steps'].append({
                'priority': 'MEDIUM',
                'task': issue.get('description', f"{issue['type']} issue"),
                'fix': issue['fix_suggestion'],
                'type': issue['type']
            })
        
        # Minor issues -> polish items
        for issue in critique['minor_issues']:
            roadmap['polish_items'].append({
                'priority': 'LOW',
                'task': issue.get('description', f"{issue['type']} refinement"),
                'fix': issue['fix_suggestion'],
                'type': issue['type']
            })
        
        return roadmap
    
    def save_analysis_report(self, analysis):
        """Save comprehensive analysis report"""
        report_path = f'{self.output_dir}/ANALYSIS_REPORT.md'
        
        with open(report_path, 'w') as f:
            f.write(f"""# Enhanced Visual Analysis Report
Analysis ID: {self.analysis_id}
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary
- **Total Issues Found**: {analysis['critique']['summary']['total_issues']}
- **Critical Issues**: {analysis['critique']['summary']['critical_count']}
- **Moderate Issues**: {analysis['critique']['summary']['moderate_count']}
- **Minor Issues**: {analysis['critique']['summary']['minor_count']}

## Critical Issues (Fix Immediately)
""")
            
            for issue in analysis['critique']['critical_issues']:
                f.write(f"### {issue['type']}\n")
                f.write(f"- **Issue**: {issue['description']}\n")
                f.write(f"- **Fix**: {issue['fix_suggestion']}\n\n")
            
            f.write("## Moderate Issues (Fix Next)\n")
            for issue in analysis['critique']['moderate_issues']:
                f.write(f"### {issue['type']}\n")
                f.write(f"- **Element**: {issue.get('element', 'N/A')}\n")
                f.write(f"- **Fix**: {issue['fix_suggestion']}\n\n")
            
            f.write("## Generated Files\n")
            f.write(f"- Screenshots: `{self.output_dir}/*_*.png`\n")
            f.write(f"- Visual Diffs: `{self.output_dir}/*_diff.png`\n")
            f.write(f"- Style Data: `{self.output_dir}/styles.json`\n")
        
        # Save styles data
        styles_path = f'{self.output_dir}/styles.json'
        with open(styles_path, 'w') as f:
            json.dump(analysis['styles'], f, indent=2, default=str)
        
        print(f"📄 Analysis report saved: {report_path}")
        return report_path

async def main():
    analyzer = EnhancedVisualAnalyzer()
    
    # Check if local development is available
    try:
        import subprocess
        result = subprocess.run(['curl', '-s', '-I', 'http://localhost:3001/'], 
                              capture_output=True, text=True, timeout=5)
        use_local = '200 OK' in result.stdout or '502' in result.stdout  # 502 is initial state
        print(f"🌐 Local development: {'Available' if use_local else 'Not available'}")
    except:
        use_local = False
    
    analysis = await analyzer.comprehensive_analysis(use_local=use_local)
    analyzer.save_analysis_report(analysis)
    
    print(f"\n🎉 Enhanced visual analysis complete!")
    print(f"📁 Results: {analyzer.output_dir}")

if __name__ == "__main__":
    asyncio.run(main())