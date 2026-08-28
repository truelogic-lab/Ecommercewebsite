#!/bin/bash

echo "🚀 Pushing ShopVerse to GitHub..."
echo ""

# Your GitHub username from the error
USERNAME="truelogic-lab"
REPO_NAME="Ecommercewebsite"

echo "📌 Using:"
echo "   Username: $USERNAME"
echo "   Repository: $REPO_NAME"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Create .gitignore
cat > .gitignore << 'GITIGNORE'
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build
dist/
build/
.parcel-cache/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Backup files
*.zip
shopverse_backup_*.zip
GITIGNORE

# Add all files
echo "📦 Adding files..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "Initial commit: ShopVerse E-Commerce Application

- React + TypeScript with Vite
- Full e-commerce flow (browse → cart → checkout → tracking)
- 50+ products across 10 categories
- GPS auto-fill location for delivery
- Order tracking with permanent storage
- Cookie consent and location prompt
- Lucide React icons
- Fully responsive design"

# Set remote URL
echo "🔗 Setting remote..."
git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code is now on GitHub:"
    echo "🔗 https://github.com/$USERNAME/$REPO_NAME"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. You have created the repository: https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. You are logged in to GitHub"
    echo ""
    echo "If repository exists, run:"
    echo "git push -u origin main --force"
fi
