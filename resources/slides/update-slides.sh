#!/bin/bash

# Script to update all slide files to use shared components
# This script adds the shared-components.js script tag to all slide files

SLIDES_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Updating slides to use shared components..."
echo "Slides directory: $SLIDES_DIR"
echo ""

# Counter for updated files
updated=0
skipped=0

# Process each page*.html file
for i in $(seq 1 50); do
    file="$SLIDES_DIR/page${i}.html"
    
    if [ -f "$file" ]; then
        # Check if file already has shared-components.js
        if grep -q "shared-components.js" "$file"; then
            echo "⏭️  Skipping page${i}.html (already updated)"
            ((skipped++))
            continue
        fi
        
        # Check if file has </body> tag
        if grep -q "</body>" "$file"; then
            # Add the shared-components.js script before </body>
            sed -i 's|</body>|    <!-- Shared Components Script - Automatically injects header and footer -->\n    <script src="js/shared-components.js"></script>\n</body>|' "$file"
            echo "✅ Updated page${i}.html"
            ((updated++))
        else
            echo "⚠️  Warning: page${i}.html has no </body> tag"
        fi
    else
        echo "❌ File not found: page${i}.html"
    fi
done

echo ""
echo "================================"
echo "Update complete!"
echo "Updated: $updated files"
echo "Skipped: $skipped files"
echo "================================"
