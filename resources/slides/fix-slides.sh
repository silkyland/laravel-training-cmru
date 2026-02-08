#!/bin/bash

# Script to add theme.css link to all slide files

SLIDES_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Adding theme.css link to slides..."
echo ""

updated=0
skipped=0

for i in $(seq 1 50); do
    file="$SLIDES_DIR/page${i}.html"
    
    if [ -f "$file" ]; then
        # Check if file already has theme.css
        if grep -q "css/theme.css" "$file"; then
            echo "⏭️  Skipping page${i}.html (already has theme.css)"
            ((skipped++))
            continue
        fi
        
        # Add theme.css link after fontawesome link (or after fonts link)
        if grep -q "@fortawesome/fontawesome-free" "$file"; then
            sed -i 's|<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>|<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>\n    <!-- Theme CSS -->\n    <link rel="stylesheet" href="css/theme.css">|' "$file"
            echo "✅ Added theme.css to page${i}.html"
            ((updated++))
        elif grep -q "font-awesome" "$file"; then
            sed -i 's|font-awesome.*rel="stylesheet"/>|font-awesome.*rel="stylesheet"/>\n    <!-- Theme CSS -->\n    <link rel="stylesheet" href="css/theme.css">|' "$file"
            echo "✅ Added theme.css to page${i}.html"
            ((updated++))
        else
            echo "⚠️  Warning: page${i}.html has no fontawesome link"
        fi
    fi
done

echo ""
echo "================================"
echo "Update complete!"
echo "Updated: $updated files"
echo "Skipped: $skipped files"
echo "================================"
