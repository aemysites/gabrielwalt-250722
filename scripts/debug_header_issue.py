#!/usr/bin/env python3
"""
Debug Header Issue - Check header rendering on live site
Analyze header element, CSS loading, and JavaScript execution
"""

import asyncio
from playwright.async_api import async_playwright

async def debug_header():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Enable console logging
        logs = []
        page.on('console', lambda msg: logs.append(f"{msg.type}: {msg.text}"))
        
        print("🔍 Loading live site...")
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/', timeout=10000)
        await page.wait_for_timeout(5000)
        
        # Check header element
        header_info = await page.evaluate('''() => {
            const header = document.querySelector("header");
            return {
                exists: !!header,
                html_length: header ? header.innerHTML.length : 0,
                computed_display: header ? getComputedStyle(header).display : null,
                computed_visibility: header ? getComputedStyle(header).visibility : null,
                computed_height: header ? getComputedStyle(header).height : null,
                children_count: header ? header.children.length : 0,
                has_nav: !!document.querySelector("header nav"),
                block_elements: Array.from(document.querySelectorAll('[class*="block"]')).length
            };
        }''')
        
        print("\n📊 HEADER ANALYSIS:")
        for key, value in header_info.items():
            print(f"  {key}: {value}")
        
        # Check if header scripts are loaded
        scripts_info = await page.evaluate('''() => {
            const scripts = Array.from(document.querySelectorAll("script[src*='header']"));
            return {
                header_scripts: scripts.length,
                scripts_urls: scripts.map(s => s.src)
            };
        }''')
        
        print("\n📄 SCRIPTS:")
        for key, value in scripts_info.items():
            print(f"  {key}: {value}")
        
        # Check console errors
        error_logs = [log for log in logs if 'error' in log.lower()]
        if error_logs:
            print("\n❌ CONSOLE ERRORS:")
            for error in error_logs[:5]:
                print(f"  {error}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_header())