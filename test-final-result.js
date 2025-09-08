const { chromium } = require('playwright');

async function testFinalResult() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1600, height: 900 }
        });
        
        console.log('🔄 Testing final header with white background...');
        const page = await context.newPage();
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/?v=' + Date.now(), {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        await page.waitForTimeout(3000);
        
        // Capture header area
        await page.screenshot({ 
            path: '/workspace/screenshots/250722/final-result-header.png',
            clip: { x: 0, y: 0, width: 1600, height: 150 }
        });
        console.log('✅ Final header result captured');
        
        // Test dropdown functionality
        const trendsDropdown = page.locator('.nav-drop').first();
        if (await trendsDropdown.count() > 0) {
            console.log('🔽 Testing dropdown hover...');
            await trendsDropdown.hover();
            await page.waitForTimeout(1000);
            
            // Capture with dropdown open
            const headerWithDropdown = page.locator('header');
            await headerWithDropdown.screenshot({ 
                path: '/workspace/screenshots/250722/final-result-with-dropdown.png'
            });
            console.log('✅ Final dropdown result captured');
        }
        
        // Get background color for verification
        const bgColor = await page.evaluate(() => {
            const body = document.querySelector('body');
            const header = document.querySelector('header');
            return {
                body: window.getComputedStyle(body).backgroundColor,
                header: window.getComputedStyle(header).backgroundColor
            };
        });
        
        console.log('🎨 Background colors:', bgColor);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

testFinalResult();