const { chromium } = require('playwright');

async function compareMegaMenus() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1600, height: 900 }
        });
        
        // 1. ORIGINAL WKND SITE - with mega menu open
        console.log('🔄 Capturing ORIGINAL site with mega menu open...');
        const originalPage = await context.newPage();
        await originalPage.goto('https://www.wknd-trendsetters.site/', {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        await originalPage.waitForTimeout(3000);
        
        // Try to hover over Trends to open mega menu
        try {
            const trendsLink = originalPage.locator('nav a, .nav a, a').filter({ hasText: 'Trends' }).first();
            if (await trendsLink.count() > 0) {
                console.log('Found Trends link, hovering...');
                await trendsLink.hover();
                await originalPage.waitForTimeout(2000);
            }
        } catch (e) {
            console.log('Could not hover Trends on original site');
        }
        
        // Capture with potential mega menu open
        await originalPage.screenshot({ 
            path: '/workspace/screenshots/250722/original-mega-menu-open.png',
            clip: { x: 0, y: 0, width: 1600, height: 400 }
        });
        console.log('✅ Original site mega menu captured');
        
        // 2. PREVIEW SITE - with mega menu open
        console.log('🔄 Capturing PREVIEW site with mega menu open...');
        const previewPage = await context.newPage();
        await previewPage.goto('https://main--gabrielwalt-250722--aemysites.aem.page/?v=' + Date.now(), {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        await previewPage.waitForTimeout(3000);
        
        // Hover over Trends dropdown
        const previewTrends = previewPage.locator('.nav-drop').first();
        if (await previewTrends.count() > 0) {
            await previewTrends.hover();
            await previewPage.waitForTimeout(2000);
            console.log('✅ Hovered over Trends on preview site');
        }
        
        await previewPage.screenshot({ 
            path: '/workspace/screenshots/250722/preview-mega-menu-open.png',
            clip: { x: 0, y: 0, width: 1600, height: 400 }
        });
        console.log('✅ Preview site mega menu captured');
        
        // 3. LOCALHOST - with mega menu open
        console.log('🔄 Capturing LOCALHOST with mega menu open...');
        const localhostPage = await context.newPage();
        await localhostPage.goto('http://localhost:3000/', {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        await localhostPage.waitForTimeout(3000);
        
        // Hover over Trends dropdown on localhost
        const localhostTrends = localhostPage.locator('.nav-drop').first();
        if (await localhostTrends.count() > 0) {
            await localhostTrends.hover();
            await localhostPage.waitForTimeout(2000);
            console.log('✅ Hovered over Trends on localhost');
        }
        
        await localhostPage.screenshot({ 
            path: '/workspace/screenshots/250722/localhost-mega-menu-open.png',
            clip: { x: 0, y: 0, width: 1600, height: 400 }
        });
        console.log('✅ Localhost mega menu captured');
        
        // Check dropdown content on each
        const previewContent = await previewPage.evaluate(() => {
            const dropdown = document.querySelector('.nav-drop[aria-expanded="true"] ul');
            return dropdown ? dropdown.innerHTML.substring(0, 300) : 'No dropdown found';
        });
        
        const localhostContent = await localhostPage.evaluate(() => {
            const dropdown = document.querySelector('.nav-drop[aria-expanded="true"] ul');
            return dropdown ? dropdown.innerHTML.substring(0, 300) : 'No dropdown found';
        });
        
        console.log('\n📊 DROPDOWN CONTENT COMPARISON:');
        console.log('Preview:', previewContent);
        console.log('Localhost:', localhostContent);
        console.log('Match?', previewContent === localhostContent ? '✅ YES' : '❌ NO');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

compareMegaMenus();