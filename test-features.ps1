# Home Credit Vietnam Extension - Feature Testing Script
# PowerShell script to test all new advanced features

Write-Host "🏛️ Home Credit Vietnam Extension - Feature Testing" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Function to test file existence
function Test-FeatureFile {
    param(
        [string]$FilePath,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description - File not found!" -ForegroundColor Red
        return $false
    }
}

# Function to test file content
function Test-FileContent {
    param(
        [string]$FilePath,
        [string]$SearchPattern,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content -match $SearchPattern) {
            Write-Host "✅ $Description" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description - Pattern not found!" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "❌ $Description - File not found!" -ForegroundColor Red
        return $false
    }
}

Write-Host "`n📁 Core Files Test" -ForegroundColor Yellow
$coreTests = @(
    @("manifest.json", "Manifest file"),
    @("popup.html", "Popup HTML"),
    @("popup.css", "Popup CSS"),
    @("popup.js", "Popup JavaScript"),
    @("content.js", "Content script"),
    @("content.css", "Content styles"),
    @("background.js", "Background service worker")
)

$corePassCount = 0
foreach ($test in $coreTests) {
    if (Test-FeatureFile -FilePath $test[0] -Description $test[1]) {
        $corePassCount++
    }
}

Write-Host "`n🧮 Smart Loan Calculator Test" -ForegroundColor Yellow
$calculatorTests = @(
    @("features/calculator.js", "Calculator JavaScript"),
    @("features/calculator.css", "Calculator CSS")
)

$calcPassCount = 0
foreach ($test in $calculatorTests) {
    if (Test-FeatureFile -FilePath $test[0] -Description $test[1]) {
        $calcPassCount++
    }
}

# Test calculator functionality
if (Test-FileContent -FilePath "features/calculator.js" -SearchPattern "class LoanCalculator" -Description "LoanCalculator class definition") {
    $calcPassCount++
}

if (Test-FileContent -FilePath "features/calculator.js" -SearchPattern "calculateMonthlyPayment" -Description "Monthly payment calculation method") {
    $calcPassCount++
}

if (Test-FileContent -FilePath "features/calculator.css" -SearchPattern "\.calculator-modal" -Description "Calculator modal styles") {
    $calcPassCount++
}

Write-Host "`n📊 Financial Health Dashboard Test" -ForegroundColor Yellow
$dashboardTests = @(
    @("features/dashboard.js", "Dashboard JavaScript"),
    @("features/dashboard.css", "Dashboard CSS")
)

$dashPassCount = 0
foreach ($test in $dashboardTests) {
    if (Test-FeatureFile -FilePath $test[0] -Description $test[1]) {
        $dashPassCount++
    }
}

# Test dashboard functionality
if (Test-FileContent -FilePath "features/dashboard.js" -SearchPattern "class FinancialHealthDashboard" -Description "FinancialHealthDashboard class definition") {
    $dashPassCount++
}

if (Test-FileContent -FilePath "features/dashboard.js" -SearchPattern "calculateHealthScore" -Description "Health score calculation method") {
    $dashPassCount++
}

if (Test-FileContent -FilePath "features/dashboard.css" -SearchPattern "\.dashboard-modal" -Description "Dashboard modal styles") {
    $dashPassCount++
}

Write-Host "`n🔔 Smart Notifications Test" -ForegroundColor Yellow
$notificationTests = @(
    @("features/smart-notifications.js", "Notifications JavaScript"),
    @("features/smart-notifications.css", "Notifications CSS")
)

$notifPassCount = 0
foreach ($test in $notificationTests) {
    if (Test-FeatureFile -FilePath $test[0] -Description $test[1]) {
        $notifPassCount++
    }
}

# Test notifications functionality
if (Test-FileContent -FilePath "features/smart-notifications.js" -SearchPattern "class SmartNotifications" -Description "SmartNotifications class definition") {
    $notifPassCount++
}

if (Test-FileContent -FilePath "features/smart-notifications.js" -SearchPattern "generateBehaviorAnalysis" -Description "Context analysis method") {
    $notifPassCount++
}

if (Test-FileContent -FilePath "features/smart-notifications.css" -SearchPattern "\.hc-notifications-modal" -Description "Notification container styles") {
    $notifPassCount++
}

Write-Host "`n🔗 Integration Test" -ForegroundColor Yellow
$integrationPassCount = 0

# Test popup integration
if (Test-FileContent -FilePath "popup.html" -SearchPattern "Máy tính vay" -Description "Loan calculator button in popup") {
    $integrationPassCount++
}

if (Test-FileContent -FilePath "popup.html" -SearchPattern "Sức khỏe tài chính" -Description "Financial dashboard button in popup") {
    $integrationPassCount++
}

if (Test-FileContent -FilePath "popup.js" -SearchPattern "handleLoanCalculator" -Description "Calculator handler in popup.js") {
    $integrationPassCount++
}

if (Test-FileContent -FilePath "popup.js" -SearchPattern "handleFinancialDashboard" -Description "Dashboard handler in popup.js") {
    $integrationPassCount++
}

# Test content script integration
if (Test-FileContent -FilePath "content.js" -SearchPattern "loadFeature" -Description "Feature loading function in content.js") {
    $integrationPassCount++
}

# Test manifest permissions
if (Test-FileContent -FilePath "manifest.json" -SearchPattern "features/\*\.js" -Description "Feature files in web_accessible_resources") {
    $integrationPassCount++
}

Write-Host "`n📋 Test Results Summary" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Core Files: $corePassCount/7 tests passed" -ForegroundColor $(if($corePassCount -eq 7) {"Green"} else {"Yellow"})
Write-Host "Smart Calculator: $calcPassCount/5 tests passed" -ForegroundColor $(if($calcPassCount -eq 5) {"Green"} else {"Yellow"})
Write-Host "Financial Dashboard: $dashPassCount/5 tests passed" -ForegroundColor $(if($dashPassCount -eq 5) {"Green"} else {"Yellow"})
Write-Host "Smart Notifications: $notifPassCount/5 tests passed" -ForegroundColor $(if($notifPassCount -eq 5) {"Green"} else {"Yellow"})
Write-Host "Integration: $integrationPassCount/6 tests passed" -ForegroundColor $(if($integrationPassCount -eq 6) {"Green"} else {"Yellow"})

$totalTests = 28
$totalPassed = $corePassCount + $calcPassCount + $dashPassCount + $notifPassCount + $integrationPassCount

Write-Host "`nOverall: $totalPassed/$totalTests tests passed" -ForegroundColor $(if($totalPassed -eq $totalTests) {"Green"} else {"Yellow"})

if ($totalPassed -eq $totalTests) {
    Write-Host "`n🎉 All tests passed! Extension is ready for deployment." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Please review the issues above." -ForegroundColor Yellow
}

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Load extension in Chrome Developer Mode (chrome://extensions/)" -ForegroundColor White
Write-Host "2. Test popup functionality by clicking the extension icon" -ForegroundColor White
Write-Host "3. Test calculator by clicking 'Máy tính vay' button" -ForegroundColor White
Write-Host "4. Test dashboard by clicking 'Sức khỏe tài chính' button" -ForegroundColor White
Write-Host "5. Check browser console for any JavaScript errors" -ForegroundColor White
Write-Host "6. Verify notification permissions are granted" -ForegroundColor White

Write-Host "`n📖 For detailed testing instructions, see TESTING.md" -ForegroundColor Gray
