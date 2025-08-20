// Popup JavaScript for Home Credit Extension
document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup loaded'); // Debug log
    
    // Initialize extension
    initializeExtension();
    
    // Event listeners
    setupEventListeners();
    
    // Load user data
    loadUserData();
});

function initializeExtension() {
    console.log('Initializing extension'); // Debug log
    // Extension initialized
    
    // Check if user is on Home Credit website
    checkCurrentPage();
    
    // Update stats from storage
    updateStats();
}

function setupEventListeners() {
    console.log('Setting up event listeners'); // Debug log
    
    // Product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const product = this.dataset.product;
            console.log('Product clicked:', product); // Debug log
            handleProductClick(product);
        });
    });
    
    // Action buttons - ensure elements exist before adding listeners
    const calculatorBtn = document.getElementById('calculator');
    const dashboardBtn = document.getElementById('dashboard');
    const creditScoreBtn = document.getElementById('credit-score-checker');
    const expenseTrackerBtn = document.getElementById('expense-tracker');
    const smartNotificationsBtn = document.getElementById('smart-notifications');
    
    if (calculatorBtn) {
        calculatorBtn.addEventListener('click', function() {
            console.log('Calculator button clicked'); // Debug log
            handleLoanCalculator();
        });
    }
    
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function() {
            console.log('Dashboard button clicked'); // Debug log
            handleFinancialDashboard();
        });
    }
    
    if (creditScoreBtn) {
        creditScoreBtn.addEventListener('click', function() {
            console.log('Credit score button clicked'); // Debug log
            handleCreditScoreChecker();
        });
    }
    
    if (expenseTrackerBtn) {
        expenseTrackerBtn.addEventListener('click', function() {
            console.log('Expense tracker button clicked'); // Debug log
            handleExpenseTracker();
        });
    }
    
    if (smartNotificationsBtn) {
        smartNotificationsBtn.addEventListener('click', function() {
            console.log('Smart notifications button clicked'); // Debug log
            handleSmartNotifications();
        });
    }
    
    // Promo items
    document.querySelectorAll('.promo-item').forEach(item => {
        item.addEventListener('click', function() {
            console.log('Promo item clicked'); // Debug log
            // Handle promo click
        });
    });
}

function handleProductClick(product) {
    const productUrls = {
        'cash-loan': 'https://www.homecredit.vn/vay-tien-mat',
        'credit-card': 'https://www.homecredit.vn/the-tin-dung',
        'paylater': 'https://www.homecredit.vn/home-paylater',
        'electronics': 'https://www.homecredit.vn/vay-tra-gop-dien-may'
    };
    
    const url = productUrls[product];
    if (url) {
        // Track click
        trackEvent('product_click', { product: product });
        
        // Open in new tab
        chrome.tabs.create({ url: url });
        
        // Show notification
        showNotification(`Đang mở trang ${getProductName(product)}...`);
    }
}

// Removed unused handlers - handleApplyLoan, handleCheckStatus, handleFindStore, handleDownloadApp, handlePromotionClick, handlePrivacyPolicy, handleHelp

function handleLoanCalculator() {
    console.log('Handling loan calculator'); // Debug log
    trackEvent('action_click', { action: 'loan_calculator' });
    
    showNotification('Đang mở máy tính vay...');
    
    // Load calculator feature if not loaded
    loadFeature('calculator').then(() => {
        console.log('Calculator feature loaded');
    }).catch(error => {
        console.error('Error loading calculator:', error);
        showNotification('Không thể mở máy tính vay. Vui lòng thử lại.');
    });
}

function handleFinancialDashboard() {
    console.log('Handling financial dashboard'); // Debug log
    trackEvent('action_click', { action: 'financial_dashboard' });
    
    showNotification('Đang mở bảng điều khiển...');
    
    // Load dashboard feature if not loaded
    loadFeature('dashboard').then(() => {
        console.log('Dashboard feature loaded');
    }).catch(error => {
        console.error('Error loading dashboard:', error);
        showNotification('Không thể mở bảng điều khiển. Vui lòng thử lại.');
    });
}

function handleCreditScoreChecker() {
    console.log('Handling credit score checker'); // Debug log
    trackEvent('action_click', { action: 'credit_score_checker' });
    
    showNotification('Đang mở kiểm tra điểm tín dụng...');
    
    // Load credit score checker feature
    loadFeature('credit-score').then(() => {
        console.log('Credit score checker loaded');
    }).catch(error => {
        console.error('Error loading credit score checker:', error);
        showNotification('Không thể mở kiểm tra điểm tín dụng. Vui lòng thử lại.');
    });
}

function handleExpenseTracker() {
    console.log('Handling expense tracker'); // Debug log
    trackEvent('action_click', { action: 'expense_tracker' });
    
    showNotification('Đang mở theo dõi chi tiêu...');
    
    // Load expense tracker feature
    loadFeature('expense-tracker').then(() => {
        console.log('Expense tracker loaded');
    }).catch(error => {
        console.error('Error loading expense tracker:', error);
        showNotification('Không thể mở theo dõi chi tiêu. Vui lòng thử lại.');
    });
}

function handleSmartNotifications() {
    console.log('Handling smart notifications'); // Debug log
    trackEvent('smart_notifications_clicked');
    
    showNotification('Đang mở thông báo thông minh...');
    
    loadFeature('smart-notifications').then(() => {
        console.log('Smart notifications loaded');
    }).catch(error => {
        console.error('Error loading smart notifications:', error);
        showNotification('Không thể mở thông báo thông minh. Vui lòng thử lại.');
    });
}

function checkCurrentPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
            const currentUrl = tabs[0].url;
            if (currentUrl && currentUrl.includes('homecredit.vn')) {
                // User is on Home Credit website
                highlightRelevantFeatures();
            }
        }
    });
}

function highlightRelevantFeatures() {
    // Add visual indicators for users already on Home Credit site
    const header = document.querySelector('.header');
    if (header) {
        header.style.borderBottom = '3px solid #4CAF50';
        
        // Add a small indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            background: #4CAF50;
            border-radius: 50%;
            box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
        `;
        header.style.position = 'relative';
        header.appendChild(indicator);
    }
}

function updateStats() {
    // Get stored stats or use defaults
    chrome.storage.local.get(['userStats'], function(result) {
        const stats = result.userStats || {
            lastVisit: null,
            totalClicks: 0,
            favoriteProduct: null
        };
        
        // Update display if needed
        if (stats.totalClicks > 0) {
            // Could show user engagement stats
            // stats available for future use
        }
    });
}

function trackEvent(eventName, data = {}) {
    // Store analytics locally
    chrome.storage.local.get(['analytics'], function(result) {
        const analytics = result.analytics || [];
        
        analytics.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
        
        // Keep only last 100 events
        if (analytics.length > 100) {
            analytics.splice(0, analytics.length - 100);
        }
        
        chrome.storage.local.set({ analytics: analytics });
    });
    
    // Event tracked for analytics
}

function showNotification(message) {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 2000);
}

function getProductName(product) {
    const names = {
        'cash-loan': 'Vay tiền mặt',
        'credit-card': 'Thẻ tín dụng',
        'paylater': 'Home PayLater',
        'electronics': 'Vay điện máy'
    };
    return names[product] || 'Sản phẩm';
}

function loadUserData() {
    // Load user preferences and history
    chrome.storage.sync.get(['userPreferences'], function(result) {
        const prefs = result.userPreferences || {};
        
        // Apply user preferences
        if (prefs.theme) {
            applyTheme(prefs.theme);
        }
        
        if (prefs.favoriteProducts) {
            highlightFavoriteProducts(prefs.favoriteProducts);
        }
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function highlightFavoriteProducts(favorites) {
    favorites.forEach(productId => {
        const productCard = document.querySelector(`[data-product="${productId}"]`);
        if (productCard) {
            productCard.style.borderColor = '#FFD700';
            productCard.style.background = 'linear-gradient(135deg, #FFF9E6, #FFFBF0)';
        }
    });
}

// Load feature dynamically
async function loadFeature(featureName) {
    try {
        console.log(`Loading feature: ${featureName}`); // Debug log
        
        // Check if we have permission to access tabs
        if (!chrome.tabs) {
            throw new Error('No tab permissions');
        }
        
        // For popup, we'll send message to content script to inject features
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && tab.id) {
            await chrome.tabs.sendMessage(tab.id, {
                action: 'loadFeature',
                featureName: featureName
            });
            console.log(`Feature ${featureName} message sent`);
        } else {
            throw new Error('No active tab found');
        }
    } catch (error) {
        console.error(`Error loading feature ${featureName}:`, error);
        throw error; // Re-throw to handle in calling function
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.close();
    }
    
    // Arrow key navigation for product cards
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        handleArrowNavigation(e);
    }
});

function handleArrowNavigation(e) {
    const focusableElements = document.querySelectorAll('.product-card, .action-btn, .promo-item');
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    
    let nextIndex;
    switch(e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
            nextIndex = (currentIndex + 1) % focusableElements.length;
            break;
        case 'ArrowUp':
        case 'ArrowLeft':
            nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            break;
    }
    
    if (nextIndex !== undefined) {
        e.preventDefault();
        focusableElements[nextIndex].focus();
    }
}
