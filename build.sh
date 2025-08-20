#!/bin/bash

# Build script for Home Credit Vietnam Chrome Extension
# This script helps prepare the extension for publication

echo "🏠 Building Home Credit Vietnam Chrome Extension..."

# Check if required files exist
echo "📋 Checking required files..."

required_files=(
    "manifest.json"
    "popup.html"
    "popup.css"
    "popup.js"
    "background.js"
    "content.js"
    "content.css"
    "README.md"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ All required files found"

# Check for icon files
echo "🎨 Checking icon files..."

icon_files=(
    "icons/icon-16.png"
    "icons/icon-32.png" 
    "icons/icon-48.png"
    "icons/icon-128.png"
)

missing_icons=()

for icon in "${icon_files[@]}"; do
    if [ ! -f "$icon" ]; then
        missing_icons+=("$icon")
    fi
done

if [ ${#missing_icons[@]} -ne 0 ]; then
    echo "⚠️  Missing icon files (use placeholders for now):"
    for icon in "${missing_icons[@]}"; do
        echo "   - $icon"
    done
    echo "   📝 See icons/README.html for instructions"
fi

# Validate manifest.json
echo "🔍 Validating manifest.json..."

if command -v jq &> /dev/null; then
    if jq . manifest.json > /dev/null 2>&1; then
        echo "✅ manifest.json is valid JSON"
        
        # Check manifest version
        manifest_version=$(jq -r '.manifest_version' manifest.json)
        if [ "$manifest_version" = "3" ]; then
            echo "✅ Using Manifest V3"
        else
            echo "⚠️  Not using Manifest V3"
        fi
    else
        echo "❌ manifest.json is invalid JSON"
        exit 1
    fi
else
    echo "⚠️  jq not found, skipping JSON validation"
fi

# Check file sizes
echo "📏 Checking file sizes..."

total_size=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo "0")
        total_size=$((total_size + size))
        echo "   $file: $(numfmt --to=iec $size)"
    fi
done

# Add icon sizes
for icon in "${icon_files[@]}"; do
    if [ -f "$icon" ]; then
        size=$(stat -c%s "$icon" 2>/dev/null || stat -f%z "$icon" 2>/dev/null || echo "0")
        total_size=$((total_size + size))
        echo "   $icon: $(numfmt --to=iec $size)"
    fi
done

echo "📦 Total extension size: $(numfmt --to=iec $total_size)"

# Check if size is reasonable for Chrome Web Store
max_size=$((20 * 1024 * 1024))  # 20MB
if [ $total_size -gt $max_size ]; then
    echo "⚠️  Extension size exceeds recommended 20MB limit"
else
    echo "✅ Extension size is within limits"
fi

# Create build directory
build_dir="build"
echo "🏗️  Creating build directory: $build_dir"

if [ -d "$build_dir" ]; then
    rm -rf "$build_dir"
fi

mkdir -p "$build_dir"

# Copy files to build directory
echo "📂 Copying files to build directory..."

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$build_dir/"
        echo "   ✅ $file"
    fi
done

# Copy icons directory
if [ -d "icons" ]; then
    cp -r "icons" "$build_dir/"
    echo "   ✅ icons/"
fi

# Create a zip file for Chrome Web Store
zip_file="home-credit-vietnam-extension.zip"
echo "📦 Creating zip file: $zip_file"

cd "$build_dir"
zip -r "../$zip_file" . -x "*.DS_Store" "*/.*"
cd ..

echo "✅ Build completed successfully!"
echo "📁 Build files: $build_dir/"
echo "📦 Extension package: $zip_file"

# Show next steps
echo ""
echo "🚀 Next steps:"
echo "1. Review files in $build_dir/"
echo "2. Test extension by loading $build_dir/ in Chrome"
echo "3. Upload $zip_file to Chrome Web Store Developer Dashboard"
echo "4. Add actual Home Credit icons to icons/ directory"
echo "5. Get extension reviewed and published"

echo ""
echo "📞 Support:"
echo "- Home Credit: 1900 633 633"
echo "- Website: https://www.homecredit.vn"

echo ""
echo "🎉 Build completed for Home Credit Vietnam Extension!"
