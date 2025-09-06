#!/usr/bin/env python3
"""
Rapid Visual Diff Tool for Autonomous Development
=================================================

Streamlined visual comparison between original WKND Trendsetters and localhost:3001
Optimized for fast iteration cycles during autonomous development.

Usage:
    python scripts/rapid_visual_diff.py [--region header|full] [--width 1600]
"""

import asyncio
import argparse
from pathlib import Path
import subprocess
import time
from playwright.async_api import async_playwright

class RapidVisualDiff:
    def __init__(self, viewport_width=1600, region="header"):
        self.viewport_width = viewport_width
        self.region = region
        self.timestamp = int(time.time())
        self.output_dir = Path(f"/workspace/tmp/rapid_diff_{self.timestamp}")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # URLs to compare
        self.original_url = "https://www.wknd.site/"
        self.local_url = "http://localhost:3001/"
        
        # Region configurations
        self.regions = {
            "header": {"height": 200, "name": "Header"},
            "full": {"height": 1200, "name": "Full Page"},
            "hero": {"height": 800, "name": "Hero Section"},
            "cards": {"height": 600, "name": "Cards Section", "offset": 800}
        }
    
    async def capture_screenshots(self):
        """Capture screenshots of both sites simultaneously for speed"""
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            
            # Create tasks for parallel capture
            original_task = self._capture_site(browser, self.original_url, "original")
            local_task = self._capture_site(browser, self.local_url, "current")
            
            # Wait for both to complete
            await asyncio.gather(original_task, local_task)
            
            await browser.close()
    
    async def _capture_site(self, browser, url, suffix):
        """Capture a single site"""
        page = await browser.new_page()
        await page.set_viewport_size({"width": self.viewport_width, "height": 1200})
        
        try:
            await page.goto(url, wait_until="networkidle")
            await page.wait_for_timeout(2000)  # Allow animations to settle
            
            region_config = self.regions[self.region]
            screenshot_path = self.output_dir / f"{suffix}_{self.region}.png"
            
            if self.region == "full":
                await page.screenshot(path=screenshot_path, full_page=True)
            else:
                # Capture specific region
                y_offset = region_config.get("offset", 0)
                await page.screenshot(
                    path=screenshot_path,
                    clip={"x": 0, "y": y_offset, "width": self.viewport_width, "height": region_config["height"]}
                )
            
            print(f"✓ Captured {suffix} screenshot: {screenshot_path.name}")
            
        except Exception as e:
            print(f"✗ Failed to capture {suffix}: {e}")
        finally:
            await page.close()
    
    def create_visual_diff(self):
        """Create visual diff using ImageMagick"""
        original_path = self.output_dir / f"original_{self.region}.png"
        current_path = self.output_dir / f"current_{self.region}.png"
        diff_path = self.output_dir / f"diff_{self.region}.png"
        
        if not (original_path.exists() and current_path.exists()):
            print("✗ Missing screenshots for comparison")
            return False
        
        try:
            # Create diff with highlighted changes
            cmd = [
                "compare",
                "-verbose",
                "-metric", "AE",
                "-compose", "src",
                "-highlight-color", "red",
                str(original_path),
                str(current_path),
                str(diff_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            # Parse ImageMagick compare output to extract pixel difference count
            diff_pixels = "0"
            if result.stderr:
                # Look for "all: XXXXX" pattern in stderr
                import re
                match = re.search(r'all:\s+(\d+)', result.stderr)
                if match:
                    diff_pixels = match.group(1)
                else:
                    # Fallback to first number found
                    numbers = re.findall(r'\d+', result.stderr)
                    if numbers:
                        diff_pixels = numbers[-1]  # Take last number as it's usually the total
            
            print(f"✓ Visual diff created: {diff_path.name}")
            print(f"✓ Different pixels: {diff_pixels}")
            
            return {
                "diff_pixels": diff_pixels,
                "diff_path": diff_path,
                "original_path": original_path,
                "current_path": current_path
            }
            
        except Exception as e:
            print(f"✗ Failed to create diff: {e}")
            return False
    
    def analyze_diff(self, diff_result):
        """Provide rapid analysis for next iteration"""
        if not diff_result:
            return
        
        diff_pixels = int(diff_result["diff_pixels"]) if diff_result["diff_pixels"].isdigit() else 0
        region_name = self.regions[self.region]["name"]
        
        print("\n" + "="*50)
        print(f"RAPID DIFF ANALYSIS - {region_name}")
        print("="*50)
        print(f"Timestamp: {time.strftime('%H:%M:%S', time.localtime(self.timestamp))}")
        print(f"Different pixels: {diff_pixels:,}")
        
        # Assessment based on pixel differences
        if diff_pixels == 0:
            status = "PERFECT MATCH ✓"
            priority = "Move to next region/block"
        elif diff_pixels < 1000:
            status = "VERY CLOSE"
            priority = "Minor tweaks needed"
        elif diff_pixels < 10000:
            status = "GOOD PROGRESS"
            priority = "Focus on remaining differences"
        elif diff_pixels < 50000:
            status = "MODERATE DIFFERENCES"
            priority = "Major layout issues to address"
        else:
            status = "SIGNIFICANT DIFFERENCES"
            priority = "Core structure needs work"
        
        print(f"Status: {status}")
        print(f"Priority: {priority}")
        print(f"\nFiles created:")
        print(f"  Original: {diff_result['original_path'].name}")
        print(f"  Current:  {diff_result['current_path'].name}")
        print(f"  Diff:     {diff_result['diff_path'].name}")
        print(f"\nOutput directory: {self.output_dir}")
        print("="*50)
        
        # Save quick results for automation
        results_file = self.output_dir / "results.txt"
        with open(results_file, "w") as f:
            f.write(f"timestamp={self.timestamp}\n")
            f.write(f"region={self.region}\n")
            f.write(f"diff_pixels={diff_pixels}\n")
            f.write(f"status={status}\n")
            f.write(f"priority={priority}\n")
    
    async def run(self):
        """Execute the complete rapid diff workflow"""
        print(f"Starting rapid visual diff for {self.regions[self.region]['name']}...")
        print(f"Viewport: {self.viewport_width}px")
        
        # Capture screenshots
        await self.capture_screenshots()
        
        # Create and analyze diff
        diff_result = self.create_visual_diff()
        self.analyze_diff(diff_result)

async def main():
    parser = argparse.ArgumentParser(description="Rapid Visual Diff for Autonomous Development")
    parser.add_argument("--region", choices=["header", "full", "hero", "cards"], default="header",
                       help="Region to compare (default: header)")
    parser.add_argument("--width", type=int, default=1600,
                       help="Viewport width (default: 1600)")
    
    args = parser.parse_args()
    
    diff_tool = RapidVisualDiff(viewport_width=args.width, region=args.region)
    await diff_tool.run()

if __name__ == "__main__":
    asyncio.run(main())