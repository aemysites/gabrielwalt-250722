#!/usr/bin/env node

const { chromium } = require('playwright-core');

async function testHeaderGeneration() {
    console.log('🚀 Testing Header JavaScript Execution');
    console.log('=====================================');
    
    let browser;
    try {
        // Launch browser
        browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Enable console logging
        page.on('console', msg => {
            console.log(`📝 Browser: ${msg.text()}`);
        });
        
        page.on('pageerror', error => {
            console.error(`❌ Page Error: ${error.message}`);
        });
        
        console.log('📡 Navigating to localhost:3000...');
        
        // Navigate to local EDS server
        await page.goto('http://localhost:3000/', {
            waitUntil: 'networkidle',
            timeout: 10000
        });
        
        console.log('✅ Page loaded');
        
        // Wait a moment for JavaScript to execute
        await page.waitForTimeout(3000);
        
        // Check header structure
        const headerAnalysis = await page.evaluate(() => {
            const header = document.querySelector('header');
            if (!header) return { error: 'No header element found' };
            
            const nav = header.querySelector('nav');
            const navBrand = header.querySelector('.nav-brand');
            const navSections = header.querySelector('.nav-sections');
            const navTools = header.querySelector('.nav-tools');
            
            return {
                headerExists: !!header,
                headerHTML: header.innerHTML.substring(0, 300) + '...',
                hasNav: !!nav,
                hasNavBrand: !!navBrand,
                hasNavSections: !!navSections,
                hasNavTools: !!navTools,
                navBrandContent: navBrand ? navBrand.innerHTML.substring(0, 100) : null,
                navSectionsContent: navSections ? navSections.innerHTML.substring(0, 200) : null,
                navToolsContent: navTools ? navTools.innerHTML.substring(0, 100) : null
            };
        });
        
        console.log('📊 Header Analysis:');
        console.log('==================');
        console.log(`Header exists: ${headerAnalysis.headerExists}`);
        console.log(`Has nav: ${headerAnalysis.hasNav}`);
        console.log(`Has nav-brand: ${headerAnalysis.hasNavBrand}`);
        console.log(`Has nav-sections: ${headerAnalysis.hasNavSections}`);
        console.log(`Has nav-tools: ${headerAnalysis.hasNavTools}`);
        
        if (headerAnalysis.hasNavBrand) {
            console.log(`Nav brand content: ${headerAnalysis.navBrandContent}`);
        }
        
        if (headerAnalysis.hasNavSections) {
            console.log(`Nav sections content: ${headerAnalysis.navSectionsContent}`);
        }
        
        if (headerAnalysis.hasNavTools) {
            console.log(`Nav tools content: ${headerAnalysis.navToolsContent}`);
        }
        
        console.log('\n📋 Full Header HTML:');
        console.log(headerAnalysis.headerHTML);
        
        // Test nav.plain.html accessibility
        console.log('\n🔍 Testing nav.plain.html accessibility...');
        const navTest = await page.evaluate(async () => {
            try {
                const response = await fetch('/nav.plain.html');
                const text = await response.text();
                return {
                    accessible: response.ok,
                    status: response.status,
                    content: text.substring(0, 200) + '...'
                };
            } catch (error) {
                return {
                    accessible: false,
                    error: error.message
                };
            }
        });
        
        console.log(`Nav fragment accessible: ${navTest.accessible}`);
        if (navTest.accessible) {
            console.log(`Nav content preview: ${navTest.content}`);
        } else {
            console.log(`Nav error: ${navTest.error}`);
        }
        
    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testHeaderGeneration().catch(console.error);