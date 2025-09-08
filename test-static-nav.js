const { chromium } = require('playwright');

async function testStaticNav() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1600, height: 900 }
        });
        
        console.log('🔄 Testing static navigation (no dropdowns)...');
        const page = await context.newPage();
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/?v=' + Date.now(), {
            waitUntil: 'networkidle',
            timeout: 15000
        });
        
        await page.waitForTimeout(3000);
        
        // Check if there are any dropdowns left
        const dropdownCount = await page.evaluate(() => {
            const dropdowns = document.querySelectorAll('.nav-drop');
            return dropdowns.length;
        });
        
        console.log(`📊 Dropdown elements found: ${dropdownCount}`);
        
        // Capture final static navigation
        await page.screenshot({ 
            path: '/workspace/screenshots/250722/final-static-navigation.png',
            clip: { x: 0, y: 0, width: 1600, height: 150 }
        });
        console.log('✅ Final static navigation captured');
        
        // Try to hover over what was Trends to see if anything happens
        const trendsLink = page.locator('a[href*="wknd-trendsetters"]').first();
        if (await trendsLink.count() > 0) {
            console.log('🔍 Testing hover on Trends link...');
            await trendsLink.hover();
            await page.waitForTimeout(2000);
            
            // Capture after hover to confirm no dropdown appears
            await page.screenshot({ 
                path: '/workspace/screenshots/250722/static-nav-after-hover.png',
                clip: { x: 0, y: 0, width: 1600, height: 200 }
            });
            console.log('✅ Post-hover screenshot captured');
        }
        
        // Check navigation structure
        const navStructure = await page.evaluate(() => {
            const navLinks = document.querySelectorAll('nav a');
            const links = [];
            navLinks.forEach(link => {
                links.push({
                    text: link.textContent.trim(),
                    href: link.href,
                    hasDropdown: link.parentElement.classList.contains('nav-drop')
                });
            });
            return links;
        });
        
        console.log('\n📊 NAVIGATION STRUCTURE:');
        navStructure.forEach(link => {
            console.log(`${link.text}: ${link.href} (Dropdown: ${link.hasDropdown})`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

testStaticNav();