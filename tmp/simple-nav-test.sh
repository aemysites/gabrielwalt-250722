#!/bin/bash

echo "=== Navigation Testing Script ==="
echo 

echo "1. Testing nav.plain.html accessibility:"
curl -s -w "HTTP Status: %{http_code}\n" https://main--gabrielwalt-250722--aemysites.aem.page/nav.plain.html | head -10
echo

echo "2. Checking if header block exists in main page:"
curl -s https://main--gabrielwalt-250722--aemysites.aem.page/ | grep -A 5 -B 5 header
echo

echo "3. Checking if metadata nav reference exists:"
curl -s https://main--gabrielwalt-250722--aemysites.aem.page/ | grep -i "nav"
echo

echo "4. Testing JavaScript bundle loading:"
curl -s https://main--gabrielwalt-250722--aemysites.aem.page/ | grep -o "scripts.*\.js" | head -5
echo

echo "5. Checking if header.js is accessible:"
curl -s -w "HTTP Status: %{http_code}\n" https://main--gabrielwalt-250722--aemysites.aem.page/blocks/header/header.js | head -5

echo
echo "=== End of Navigation Test ==="