# Home Credit Extension Build Script
# Builds and packages the extension for production

Write-Host "🏗️ Building Home Credit Extension for Production" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Create build directory
$buildDir = "build"
if (Test-Path $buildDir) {
    Remove-Item $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $buildDir | Out-Null
Write-Host "✅ Created build directory" -ForegroundColor Green

# Copy core files
$coreFiles = @(
    "manifest.json",
    "popup.html", 
    "popup.css",
    "popup.js",
    "content.js",
    "content.css", 
    "background.js"
)

foreach ($file in $coreFiles) {
    if (Test-Path $file) {
        Copy-Item $file $buildDir
        Write-Host "✅ Copied $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing core file: $file" -ForegroundColor Red
    }
}

# Copy features directory
if (Test-Path "features") {
    Copy-Item "features" $buildDir -Recurse
    Write-Host "✅ Copied features directory" -ForegroundColor Green
} else {
    Write-Host "❌ Missing features directory" -ForegroundColor Red
}

# Copy icons directory  
if (Test-Path "icons") {
    Copy-Item "icons" $buildDir -Recurse
    Write-Host "✅ Copied icons directory" -ForegroundColor Green
} else {
    Write-Host "❌ Missing icons directory" -ForegroundColor Red
}

# Copy documentation files
$docFiles = @("README.md", "TESTING.md")
foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Copy-Item $file $buildDir
        Write-Host "✅ Copied $file" -ForegroundColor Green
    }
}

# Minify JavaScript files (basic minification)
Write-Host "`n🔧 Optimizing files..." -ForegroundColor Yellow

$jsFiles = Get-ChildItem -Path $buildDir -Filter "*.js" -Recurse
foreach ($file in $jsFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove comments and extra whitespace
    $content = $content -replace '/\*[\s\S]*?\*/', ''  # Remove /* */ comments
    $content = $content -replace '//.*$', '', 'Multiline'  # Remove // comments
    $content = $content -replace '\s+', ' '  # Reduce multiple spaces to single
    $content = $content.Trim()
    
    Set-Content $file.FullName $content -NoNewline
    Write-Host "✅ Optimized $($file.Name)" -ForegroundColor Green
}

# Minify CSS files
$cssFiles = Get-ChildItem -Path $buildDir -Filter "*.css" -Recurse
foreach ($file in $cssFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove comments and extra whitespace  
    $content = $content -replace '/\*[\s\S]*?\*/', ''  # Remove /* */ comments
    $content = $content -replace '\s+', ' '  # Reduce multiple spaces to single
    $content = $content -replace ';\s*}', '}' # Remove semicolon before closing brace
    $content = $content.Trim()
    
    Set-Content $file.FullName $content -NoNewline
    Write-Host "✅ Optimized $($file.Name)" -ForegroundColor Green
}

# Create zip package for Chrome Web Store
$zipFile = "home-credit-extension-v2.0.0.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory((Resolve-Path $buildDir).Path, $zipFile)

Write-Host "`n📦 Package created: $zipFile" -ForegroundColor Green

# Calculate file sizes
$buildSize = (Get-ChildItem $buildDir -Recurse | Measure-Object -Property Length -Sum).Sum
$zipSize = (Get-Item $zipFile).Length

Write-Host "`n📊 Build Statistics:" -ForegroundColor Cyan
Write-Host "Build directory size: $([math]::Round($buildSize / 1KB, 2)) KB" -ForegroundColor White
Write-Host "Zip package size: $([math]::Round($zipSize / 1KB, 2)) KB" -ForegroundColor White

# Validate manifest
$manifest = Get-Content "$buildDir/manifest.json" | ConvertFrom-Json
Write-Host "`n✅ Extension Info:" -ForegroundColor Cyan
Write-Host "Name: $($manifest.name)" -ForegroundColor White
Write-Host "Version: $($manifest.version)" -ForegroundColor White  
Write-Host "Description: $($manifest.description)" -ForegroundColor White

Write-Host "`n🚀 Build Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the extension by loading the 'build' folder in Chrome Developer Mode" -ForegroundColor White
Write-Host "2. If everything works, upload '$zipFile' to Chrome Web Store" -ForegroundColor White
Write-Host "3. For updates, increment version in manifest.json and rebuild" -ForegroundColor White
