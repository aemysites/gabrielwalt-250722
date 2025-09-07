const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testNavigation() {
    let browser;
    try {
        // Try to use installed Chromium first
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Enable console logging from the page
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        
        console.log('Navigating to live site...');
        await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for any header content to load
        await page.waitForTimeout(5000);
        
        // Check if navigation has loaded
        const headerContent = await page.evaluate(() => {
            const header = document.querySelector('header');
            return {
                isEmpty: header.innerHTML.trim() === '',
                content: header.innerHTML.substring(0, 200) + '...',
                hasNav: !!header.querySelector('nav'),
                navContent: header.querySelector('nav') ? header.querySelector('nav').innerHTML.substring(0, 200) + '...' : null
            };
        });
        
        console.log('Header Analysis:', headerContent);
        
        // Check if nav.plain.html loads properly
        const navResponse = await page.goto('https://main--gabrielwalt-250722--aemysites.aem.page/nav.plain.html');
        const navContent = await navResponse.text();
        console.log('Nav fragment loads:', navResponse.ok());
        console.log('Nav fragment content preview:', navContent.substring(0, 200) + '...');
        
    } catch (error) {
        console.error('Error testing navigation:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testNavigation();