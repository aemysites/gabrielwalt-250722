const { chromium } = require('playwright');

async function testSimplifiedNav() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1600, height: 900 }
        });
        
        console.log('🔄 Testing simplified navigation...');
        const page = await context.newPage();
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/?v=' + Date.now(), {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        // Wait for page to load
        await page.waitForTimeout(3000);
        
        // Hover over Trends to open dropdown  
        await page.hover('.nav-drop:has-text("Trends")');
        await page.waitForTimeout(1000);
        
        // Take screenshot of new simplified dropdown
        const headerElement = await page.locator('header');
        await headerElement.screenshot({ 
            path: '/workspace/screenshots/250722/simplified-mega-menu.png'
        });
        console.log('✅ Simplified navigation captured');
        
        // Check dropdown state
        const dropdownState = await page.evaluate(() => {
            const trendsDropdown = document.querySelector('.nav-drop:has-text("Trends")');
            return {
                expanded: trendsDropdown ? trendsDropdown.getAttribute('aria-expanded') : null,
                hasItems: trendsDropdown ? trendsDropdown.querySelectorAll('ul li').length : 0
            };
        });
        
        console.log('📊 Dropdown state:', dropdownState);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

testSimplifiedNav();