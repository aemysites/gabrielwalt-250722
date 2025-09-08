const { chromium } = require('playwright');

async function captureClickMenus() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1600, height: 900 }
        });
        
        // 1. ORIGINAL WKND SITE - with mega menu opened by CLICK
        console.log('🔄 Capturing ORIGINAL site Trends menu (CLICK)...');
        const originalPage = await context.newPage();
        await originalPage.goto('https://www.wknd-trendsetters.site/', {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        await originalPage.waitForTimeout(3000);
        
        // Find and CLICK Trends link (not hover)
        try {
            const trendsLink = originalPage.locator('nav a, .nav a, a').filter({ hasText: 'Trends' }).first();
            if (await trendsLink.count() > 0) {
                console.log('Found Trends link, clicking...');
                await trendsLink.click();
                await originalPage.waitForTimeout(2000);
                console.log('✅ Clicked Trends on original site');
            }
        } catch (e) {
            console.log('Could not click Trends on original site');
        }
        
        // Capture with mega menu open
        await originalPage.screenshot({ 
            path: '/workspace/screenshots/250722/original-trends-clicked.png',
            clip: { x: 0, y: 0, width: 1600, height: 500 }
        });
        console.log('✅ Original site Trends menu (clicked) captured');
        
        // 2. CURRENT PREVIEW SITE - with mega menu opened  
        console.log('🔄 Capturing CURRENT preview site mega menu...');
        const previewPage = await context.newPage();
        await previewPage.goto('https://main--gabrielwalt-250722--aemysites.aem.page/?v=' + Date.now(), {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        await previewPage.waitForTimeout(3000);
        
        // Hover over Trends to open mega menu
        const previewTrends = previewPage.locator('.nav-drop').first();
        if (await previewTrends.count() > 0) {
            await previewTrends.hover();
            await previewPage.waitForTimeout(2000);
            console.log('✅ Opened Trends mega menu on preview site');
        }
        
        await previewPage.screenshot({ 
            path: '/workspace/screenshots/250722/current-trends-open.png',
            clip: { x: 0, y: 0, width: 1600, height: 500 }
        });
        console.log('✅ Current preview mega menu captured');
        
        // Also capture just the header for width comparison
        await originalPage.screenshot({ 
            path: '/workspace/screenshots/250722/original-header-width.png',
            clip: { x: 0, y: 0, width: 1600, height: 100 }
        });
        
        await previewPage.screenshot({ 
            path: '/workspace/screenshots/250722/current-header-width.png',
            clip: { x: 0, y: 0, width: 1600, height: 100 }
        });
        
        console.log('✅ Header width comparison screenshots captured');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

captureClickMenus();