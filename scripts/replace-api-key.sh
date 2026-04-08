#!/bin/bash

# Replace API key placeholder with actual key
API_KEY="$1"

if [ -z "$API_KEY" ]; then
  echo "Error: API key not provided"
  exit 1
fi

echo "Replacing API key placeholder in built files..."

# Find all JS files in dist/assets
for file in dist/assets/*.js; do
  if [ -f "$file" ]; then
    # Use perl for more reliable replacement
    perl -pi -e "s/__OPENROUTER_KEY__/$API_KEY/g" "$file"
    
    # Verify replacement
    if grep -q "__OPENROUTER_KEY__" "$file"; then
      echo "WARNING: Placeholder still found in $file"
    else
      echo "✓ Processed: $file"
    fi
  fi
done

echo "API key replacement complete"
