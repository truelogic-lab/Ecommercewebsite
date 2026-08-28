#!/bin/bash

# Create a zip backup of the entire ShopVerse project
echo "📦 Packaging ShopVerse project..."

# Define the output filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="shopverse_backup_${TIMESTAMP}.zip"

# Create the zip file excluding node_modules, dist, .git and other unnecessary files
zip -r "$OUTPUT_FILE" . \
  -x "node_modules/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x ".vscode/*" \
  -x "*.log" \
  -x ".DS_Store" \
  -x "*.zip" \
  -x "backup_*.zip"

if [ $? -eq 0 ]; then
  echo "✅ Backup created successfully: $OUTPUT_FILE"
  echo "📁 File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
  echo ""
  echo "To download to your device, you can:"
  echo "1. Use the terminal: scp user@server:$OUTPUT_FILE ./"
  echo "2. Use SFTP/FTPS to download the file"
  echo "3. If running locally, the file is in: $(pwd)/$OUTPUT_FILE"
else
  echo "❌ Failed to create backup"
  exit 1
fi
