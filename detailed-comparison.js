const { chromium } = require('playwright');

async function detailedComparison() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1600, height: 900 }
        });
        
        console.log('🔄 Capturing detailed original site...');
        const originalPage = await context.newPage();
        await originalPage.goto('https://www.wknd-trendsetters.site/', {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        await originalPage.waitForTimeout(3000);
        
        // Skip hover interaction on original site - just capture static header
        console.log('📸 Capturing static header from original site');
        
        // Always capture top of page to get actual header/nav
        await originalPage.screenshot({ 
            path: '/workspace/screenshots/250722/original-header-top.png',
            clip: { x: 0, y: 0, width: 1600, height: 150 }
        });
        
        // Also capture the navigation area specifically 
        const nav = originalPage.locator('nav, .nav, .header, .navigation').first();
        if (await nav.count() > 0) {
            await nav.screenshot({ 
                path: '/workspace/screenshots/250722/original-nav-only.png'
            });
        }
        console.log('✅ Original site detailed screenshot captured');
        
        console.log('🔄 Capturing current implementation...');
        const currentPage = await context.newPage();
        await currentPage.goto('https://main--gabrielwalt-250722--aemysites.aem.page/?v=' + Date.now(), {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        await currentPage.waitForTimeout(3000);
        
        // Hover over Trends dropdown
        const currentTrends = currentPage.locator('.nav-drop').first();
        if (await currentTrends.count() > 0) {
            await currentTrends.hover();
            await currentPage.waitForTimeout(1500);
        }
        
        const currentHeader = currentPage.locator('header');
        await currentHeader.screenshot({ 
            path: '/workspace/screenshots/250722/current-detailed.png'
        });
        console.log('✅ Current implementation detailed screenshot captured');
        
        // Get detailed styles comparison
        const originalStyles = await originalPage.evaluate(() => {
            const nav = document.querySelector('nav, header');
            const trendsLink = document.querySelector('a[href*="trends"], a:contains("Trends")');
            
            if (!nav) return null;
            
            const navStyles = window.getComputedStyle(nav);
            return {
                background: navStyles.backgroundColor,
                fontSize: navStyles.fontSize,
                fontFamily: navStyles.fontFamily,
                padding: navStyles.padding,
                height: navStyles.height,
                trendsFound: !!trendsLink
            };
        });
        
        const currentStyles = await currentPage.evaluate(() => {
            const nav = document.querySelector('header nav');
            const trendsLink = document.querySelector('.nav-drop');
            
            if (!nav) return null;
            
            const navStyles = window.getComputedStyle(nav);
            return {
                background: navStyles.backgroundColor,
                fontSize: navStyles.fontSize,
                fontFamily: navStyles.fontFamily,
                padding: navStyles.padding,
                height: navStyles.height,
                trendsFound: !!trendsLink
            };
        });
        
        console.log('\n📊 STYLE COMPARISON:');
        console.log('Original:', originalStyles);
        console.log('Current:', currentStyles);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

detailedComparison();