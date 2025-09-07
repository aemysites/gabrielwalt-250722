const { chromium } = require('playwright');

async function captureMegaMenus() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1600, height: 900 }
        });
        
        // Capture preview site mega menu
        console.log('🔄 Capturing preview site mega menu...');
        const previewPage = await context.newPage();
        await previewPage.goto('https://main--gabrielwalt-250722--aemysites.aem.page/', {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        // Wait for page to load
        await previewPage.waitForTimeout(3000);
        
        // Hover over Trends to open mega menu
        await previewPage.hover('.nav-drop:has-text("Trends")');
        await previewPage.waitForTimeout(1000);
        
        // Take screenshot of mega menu area
        const headerElement = await previewPage.locator('header');
        await headerElement.screenshot({ 
            path: '/workspace/screenshots/250722/current-mega-menu.png'
        });
        console.log('✅ Preview mega menu captured');
        
        // Capture original site mega menu
        console.log('🔄 Capturing original site mega menu...');
        const originalPage = await context.newPage();
        await originalPage.goto('https://www.wknd-trendsetters.site/', {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        // Wait for page to load
        await originalPage.waitForTimeout(3000);
        
        // Look for Trends dropdown and hover
        try {
            await originalPage.hover('nav a:has-text("Trends"), .nav-item:has-text("Trends"), [aria-label*="Trends"]');
            await originalPage.waitForTimeout(1000);
        } catch (e) {
            console.log('Note: Could not find Trends dropdown on original site');
        }
        
        // Take screenshot of header area
        const originalHeader = await originalPage.locator('header, nav, .header, .navigation').first();
        await originalHeader.screenshot({ 
            path: '/workspace/screenshots/250722/original-mega-menu.png'
        });
        console.log('✅ Original site header captured');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

captureMegaMenus();