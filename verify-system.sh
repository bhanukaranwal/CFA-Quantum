#!/bin/bash

echo "🔍 CFA Quantum System Verification"
echo "=================================="

# Check critical files
echo "📁 Checking core files..."
files=(
  "package.json"
  "tsconfig.json"
  "next.config.js"
  "tailwind.config.js"
  "src/app/layout.tsx"
  "src/app/page.tsx"
  "src/lib/auth.ts"
  "src/lib/db.ts"
  "prisma/schema.prisma"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - MISSING!"
  fi
done

# Check UI components
echo "🎨 Checking UI components..."
components=(
  "alert" "avatar" "badge" "button" "card" "checkbox"
  "dialog" "dropdown-menu" "input" "label" "progress"
  "select" "separator" "tabs" "toast" "toaster"
)

for comp in "${components[@]}"; do
  if [ -f "src/components/ui/$comp.tsx" ]; then
    echo "✅ $comp.tsx"
  else
    echo "❌ $comp.tsx - MISSING!"
  fi
done

# Run checks
echo "🔧 Running system checks..."
npm run type-check && echo "✅ TypeScript OK" || echo "❌ TypeScript ERRORS"
npm run lint && echo "✅ ESLint OK" || echo "❌ ESLint ERRORS"
npx prisma validate && echo "✅ Database Schema OK" || echo "❌ Schema ERRORS"

echo "✅ Verification Complete!"