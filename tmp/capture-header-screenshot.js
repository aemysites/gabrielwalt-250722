#!/usr/bin/env node

const { chromium } = require('playwright-core');
const fs = require('fs');

async function captureHeaderScreenshot() {
    console.log('📸 Capturing Header Screenshot');
    console.log('==============================');
    
    let browser;
    try {
        browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 720 });
        
        console.log('📡 Loading localhost:3000...');
        await page.goto('http://localhost:3000/', {
            waitUntil: 'networkidle',
            timeout: 10000
        });
        
        // Wait for JavaScript to load header
        await page.waitForTimeout(3000);
        
        // Take full page screenshot
        await page.screenshot({ 
            path: '/workspace/projects/gabrielwalt-250722/tmp/header-local-full.png',
            fullPage: true
        });
        console.log('✅ Full page screenshot saved: tmp/header-local-full.png');
        
        // Take header-only screenshot
        const headerElement = await page.locator('header');
        if (await headerElement.count() > 0) {
            await headerElement.screenshot({ 
                path: '/workspace/projects/gabrielwalt-250722/tmp/header-local-only.png'
            });
            console.log('✅ Header screenshot saved: tmp/header-local-only.png');
            
            // Get header dimensions
            const headerBox = await headerElement.boundingBox();
            if (headerBox) {
                console.log(`📏 Header dimensions: ${headerBox.width}x${headerBox.height}`);
            }
        }
        
        // Analyze header visibility and styling
        const headerStatus = await page.evaluate(() => {
            const header = document.querySelector('header');
            if (!header) return { visible: false, error: 'No header found' };
            
            const computedStyle = window.getComputedStyle(header);
            const nav = header.querySelector('nav');
            const navComputed = nav ? window.getComputedStyle(nav) : null;
            
            return {
                visible: computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
                headerDisplay: computedStyle.display,
                headerHeight: computedStyle.height,
                headerBackground: computedStyle.backgroundColor,
                hasNav: !!nav,
                navDisplay: navComputed ? navComputed.display : null,
                navHeight: navComputed ? navComputed.height : null,
                navBackground: navComputed ? navComputed.backgroundColor : null,
                hasContent: header.innerHTML.length > 50
            };
        });
        
        console.log('📊 Header Status:');
        console.log(`Visible: ${headerStatus.visible}`);
        console.log(`Display: ${headerStatus.headerDisplay}`);
        console.log(`Height: ${headerStatus.headerHeight}`);
        console.log(`Background: ${headerStatus.headerBackground}`);
        console.log(`Has nav: ${headerStatus.hasNav}`);
        console.log(`Nav display: ${headerStatus.navDisplay}`);
        console.log(`Nav height: ${headerStatus.navHeight}`);
        console.log(`Has content: ${headerStatus.hasContent}`);
        
        // Compare with original WKND site styling
        console.log('\n🎯 Style Analysis vs Original:');
        const styleAnalysis = await page.evaluate(() => {
            const nav = document.querySelector('header nav');
            if (!nav) return { error: 'No nav found' };
            
            const navStyle = window.getComputedStyle(nav);
            const brand = nav.querySelector('.nav-brand');
            const sections = nav.querySelector('.nav-sections');
            const tools = nav.querySelector('.nav-tools');
            
            return {
                navJustifyContent: navStyle.justifyContent,
                navAlignItems: navStyle.alignItems,
                navPadding: navStyle.padding,
                navMaxWidth: navStyle.maxWidth,
                hasBrand: !!brand,
                hasSections: !!sections,
                hasTools: !!tools,
                brandVisible: brand ? window.getComputedStyle(brand).display !== 'none' : false,
                sectionsVisible: sections ? window.getComputedStyle(sections).display !== 'none' : false,
                toolsVisible: tools ? window.getComputedStyle(tools).display !== 'none' : false
            };
        });
        
        console.log(`Nav layout: ${styleAnalysis.navJustifyContent} / ${styleAnalysis.navAlignItems}`);
        console.log(`Nav padding: ${styleAnalysis.navPadding}`);
        console.log(`Nav max-width: ${styleAnalysis.navMaxWidth}`);
        console.log(`Sections visible: Brand(${styleAnalysis.brandVisible}) Sections(${styleAnalysis.sectionsVisible}) Tools(${styleAnalysis.toolsVisible})`);
        
    } catch (error) {
        console.error(`❌ Screenshot failed: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

captureHeaderScreenshot().catch(console.error);