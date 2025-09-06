#!/usr/bin/env python3
"""
Page Block Mapper - Map all pages and their specific block instances
Identifies exact blocks on each page for targeted optimization
"""

import asyncio
import json
from playwright.async_api import async_playwright

async def map_page_blocks():
    """Map blocks on each page of the site"""
    
    pages_to_analyze = [
        '/',  # Homepage
        '/fashion-trends-of-the-season',  # About
        '/fashion-insights',  # Blog
        '/faq',  # FAQ/Support
    ]
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        results = {}
        
        for page_path in pages_to_analyze:
            print(f"🔍 Analyzing: {page_path}")
            
            try:
                await page.goto(f'https://main--gabrielwalt-250722--aemysites.aem.page{page_path}', timeout=15000)
                await page.wait_for_timeout(3000)
                
                # Get all blocks on this page
                page_analysis = await page.evaluate('''() => {
                    const blocks = [];
                    
                    // Find all block elements
                    const blockElements = document.querySelectorAll('[class*="block"], .cards, .columns, .hero, .teaser, .accordion, .tabs');
                    
                    blockElements.forEach((element, index) => {
                        const rect = element.getBoundingClientRect();
                        const style = getComputedStyle(element);
                        
                        // Skip if not visible or tiny
                        if (rect.width < 50 || rect.height < 50) return;
                        
                        blocks.push({
                            index: index,
                            className: element.className,
                            tagName: element.tagName,
                            dimensions: {
                                width: Math.round(rect.width),
                                height: Math.round(rect.height),
                                top: Math.round(rect.top),
                                left: Math.round(rect.left)
                            },
                            styles: {
                                display: style.display,
                                position: style.position,
                                background: style.backgroundColor
                            },
                            content_preview: element.textContent.substring(0, 100).replace(/\\s+/g, ' ').trim(),
                            has_images: element.querySelectorAll('img').length,
                            has_links: element.querySelectorAll('a').length
                        });
                    });
                    
                    return {
                        total_blocks: blocks.length,
                        blocks: blocks,
                        page_title: document.title,
                        page_description: document.querySelector('meta[name="description"]')?.content || '',
                        viewport_height: window.innerHeight
                    };
                }''')
                
                results[page_path] = page_analysis
                print(f"  ✅ Found {page_analysis['total_blocks']} blocks")
                
            except Exception as e:
                print(f"  ❌ Error analyzing {page_path}: {e}")
                results[page_path] = {'error': str(e)}
        
        await browser.close()
        return results

async def main():
    print("=" * 70)
    print("PAGE-BY-PAGE BLOCK MAPPING")
    print("=" * 70)
    
    results = await map_page_blocks()
    
    # Generate optimization plan
    optimization_plan = []
    total_blocks = 0
    
    for page_path, data in results.items():
        if 'error' in data:
            continue
            
        total_blocks += data['total_blocks']
        
        # Sort blocks by size (largest first = highest visual impact)
        blocks = sorted(data['blocks'], key=lambda x: x['dimensions']['width'] * x['dimensions']['height'], reverse=True)
        
        page_plan = {
            'page': page_path,
            'title': data['page_title'],
            'total_blocks': data['total_blocks'],
            'priority_blocks': blocks[:5],  # Top 5 blocks by size
            'optimization_potential': sum(b['dimensions']['width'] * b['dimensions']['height'] for b in blocks[:3])
        }
        
        optimization_plan.append(page_plan)
    
    # Sort pages by optimization potential
    optimization_plan.sort(key=lambda x: x['optimization_potential'], reverse=True)
    
    print(f"\\n📊 DISCOVERED {total_blocks} BLOCKS across {len(results)} pages")
    print("\\n🎯 PAGE OPTIMIZATION PRIORITY:")
    
    for i, plan in enumerate(optimization_plan):
        print(f"\\n{i+1}. {plan['page']} - {plan['title']}")
        print(f"   Total blocks: {plan['total_blocks']}")
        print(f"   Optimization potential: {plan['optimization_potential']:,} pixels")
        print("   Top blocks:")
        
        for j, block in enumerate(plan['priority_blocks'][:3]):
            size = block['dimensions']['width'] * block['dimensions']['height']
            preview = block['content_preview'][:50] + '...' if len(block['content_preview']) > 50 else block['content_preview']
            print(f"     {j+1}. {block['className'][:30]} ({size:,}px) - {preview}")
    
    # Save detailed results
    with open('/workspace/tmp/page_block_mapping.json', 'w') as f:
        json.dump(results, f, indent=2)
        
    with open('/workspace/tmp/optimization_plan.json', 'w') as f:
        json.dump(optimization_plan, f, indent=2)
    
    print(f"\\n✅ Detailed mapping saved to: /workspace/tmp/page_block_mapping.json")
    print(f"✅ Optimization plan saved to: /workspace/tmp/optimization_plan.json")
    
    # Generate next steps
    if optimization_plan:
        top_page = optimization_plan[0]
        print(f"\\n🚀 NEXT AUTONOMOUS ACTION:")
        print(f"Start with: {top_page['page']} ({top_page['optimization_potential']:,} pixel potential)")
        print(f"Focus on: {top_page['priority_blocks'][0]['className']}")

if __name__ == "__main__":
    asyncio.run(main())