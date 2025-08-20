# Build script for Home Credit Vietnam Chrome Extension (Windows PowerShell)
# This script helps prepare the extension for publication

Write-Host "🏠 Building Home Credit Vietnam Chrome Extension..." -ForegroundColor Green

# Check if required files exist
Write-Host "📋 Checking required files..." -ForegroundColor Yellow

$requiredFiles = @(
    "manifest.json",
    "popup.html", 
    "popup.css",
    "popup.js",
    "background.js",
    "content.js",
    "content.css",
    "README.md"
)

$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Missing required files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    exit 1
}

Write-Host "✅ All required files found" -ForegroundColor Green

# Check for icon files
Write-Host "🎨 Checking icon files..." -ForegroundColor Yellow

$iconFiles = @(
    "icons\icon-16.png",
    "icons\icon-32.png",
    "icons\icon-48.png", 
    "icons\icon-128.png"
)

$missingIcons = @()

foreach ($icon in $iconFiles) {
    if (-not (Test-Path $icon)) {
        $missingIcons += $icon
    }
}

if ($missingIcons.Count -gt 0) {
    Write-Host "⚠️  Missing icon files (use placeholders for now):" -ForegroundColor Yellow
    foreach ($icon in $missingIcons) {
        Write-Host "   - $icon" -ForegroundColor Yellow
    }
    Write-Host "   📝 See icons\README.html for instructions" -ForegroundColor Cyan
}

# Validate manifest.json
Write-Host "🔍 Validating manifest.json..." -ForegroundColor Yellow

try {
    $manifest = Get-Content "manifest.json" | ConvertFrom-Json
    Write-Host "✅ manifest.json is valid JSON" -ForegroundColor Green
    
    if ($manifest.manifest_version -eq 3) {
        Write-Host "✅ Using Manifest V3" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not using Manifest V3" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ manifest.json is invalid JSON" -ForegroundColor Red
    exit 1
}

# Check file sizes
Write-Host "📏 Checking file sizes..." -ForegroundColor Yellow

$totalSize = 0
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        $totalSize += $size
        $sizeKB = [math]::Round($size / 1KB, 2)
        Write-Host "   $file`: $sizeKB KB" -ForegroundColor Cyan
    }
}

# Add icon sizes
foreach ($icon in $iconFiles) {
    if (Test-Path $icon) {
        $size = (Get-Item $icon).Length
        $totalSize += $size
        $sizeKB = [math]::Round($size / 1KB, 2)
        Write-Host "   $icon`: $sizeKB KB" -ForegroundColor Cyan
    }
}

$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "📦 Total extension size: $totalSizeMB MB" -ForegroundColor Cyan

# Check if size is reasonable for Chrome Web Store
$maxSizeMB = 20
if ($totalSizeMB -gt $maxSizeMB) {
    Write-Host "⚠️  Extension size exceeds recommended 20MB limit" -ForegroundColor Yellow
} else {
    Write-Host "✅ Extension size is within limits" -ForegroundColor Green
}

# Create build directory
$buildDir = "build"
Write-Host "🏗️  Creating build directory: $buildDir" -ForegroundColor Yellow

if (Test-Path $buildDir) {
    Remove-Item $buildDir -Recurse -Force
}

New-Item -ItemType Directory -Path $buildDir | Out-Null

# Copy files to build directory
Write-Host "📂 Copying files to build directory..." -ForegroundColor Yellow

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Copy-Item $file $buildDir
        Write-Host "   ✅ $file" -ForegroundColor Green
    }
}

# Copy icons directory
if (Test-Path "icons") {
    Copy-Item "icons" $buildDir -Recurse
    Write-Host "   ✅ icons\" -ForegroundColor Green
}

# Create a zip file for Chrome Web Store
$zipFile = "home-credit-vietnam-extension.zip"
Write-Host "📦 Creating zip file: $zipFile" -ForegroundColor Yellow

if (Test-Path $zipFile) {
    Remove-Item $zipFile
}

# Use .NET to create zip file
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory((Resolve-Path $buildDir), $zipFile)

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Build files: $buildDir\" -ForegroundColor Cyan
Write-Host "📦 Extension package: $zipFile" -ForegroundColor Cyan

# Show next steps
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Green
Write-Host "1. Review files in $buildDir\" -ForegroundColor White
Write-Host "2. Test extension by loading $buildDir\ in Chrome" -ForegroundColor White
Write-Host "3. Upload $zipFile to Chrome Web Store Developer Dashboard" -ForegroundColor White
Write-Host "4. Add actual Home Credit icons to icons\ directory" -ForegroundColor White
Write-Host "5. Get extension reviewed and published" -ForegroundColor White

Write-Host ""
Write-Host "📞 Support:" -ForegroundColor Cyan
Write-Host "- Home Credit: 1900 633 633" -ForegroundColor White
Write-Host "- Website: https://www.homecredit.vn" -ForegroundColor White

Write-Host ""
Write-Host "🎉 Build completed for Home Credit Vietnam Extension!" -ForegroundColor Green
