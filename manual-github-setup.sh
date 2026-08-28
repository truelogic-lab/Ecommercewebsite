#!/bin/bash

echo "🚀 Manual GitHub Setup for ShopVerse"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " username

# Get repository name
read -p "Enter repository name (default: shopverse): " repo_name
repo_name=${repo_name:-shopverse}

echo ""
echo "📝 Please follow these steps:"
echo ""
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named: $repo_name"
echo "3. Do NOT initialize with README, .gitignore, or license"
echo "4. Click 'Create repository'"
echo ""
read -p "Press Enter after creating the repository on GitHub..."

echo ""
echo "📦 Pushing code to GitHub..."
echo ""

# Initialize git if not already
if [ ! -d ".git" ]; then
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
git add .

# Commit
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
git remote add origin "https://github.com/$username/$repo_name.git"

# Push to GitHub
git branch -M main
git push -u origin main

echo ""
echo "✅ Done! Your code is now on GitHub:"
echo "🔗 https://github.com/$username/$repo_name"
echo ""
echo "📋 To collaborate or clone:"
echo "git clone https://github.com/$username/$repo_name.git"
