#!/bin/bash

# Pre-commit linting check script
# Run this before committing to catch linting issues early

echo "🔍 Running pre-commit checks..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run linting
echo "🧹 Running ESLint..."
if npm run lint:js; then
    echo "✅ JavaScript linting passed"
else
    echo "❌ JavaScript linting failed"
    echo "💡 Try running: npm run lint:js -- --fix"
    exit 1
fi

# Run CSS linting  
echo "🎨 Running CSS linting..."
if npm run lint:css; then
    echo "✅ CSS linting passed"
else
    echo "❌ CSS linting failed"
    exit 1
fi

echo "🎉 All pre-commit checks passed!"