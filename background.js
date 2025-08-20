// Background Script for Home Credit Extension
// This runs persistently and handles events

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Home Credit Extension installed:', details.reason);
    
    if (details.reason === 'install') {
        // First time installation
        setupExtension();
        showWelcomeNotification();
    } else if (details.reason === 'update') {
        // Extension updated
        console.log('Extension updated to version:', chrome.runtime.getManifest().version);
    }
});

// Setup extension defaults
function setupExtension() {
    // Set default storage values
    chrome.storage.local.set({
        lastVisit: new Date().toISOString(),
        totalClicks: 0,
        installDate: new Date().toISOString(),
        settings: {
            notifications: true,
            autoDetectHomeCreditPages: true,
            showPromotions: true
        }
    });
    
    // Set badge text
    chrome.action.setBadgeText({ text: 'NEW' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF6B35' });
    
    // Clear badge after 24 hours
    setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
    }, 24 * 60 * 60 * 1000);
}

// Welcome notification
function showWelcomeNotification() {
    chrome.notifications.create('welcome', {
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: 'Chào mừng đến với Home Credit!',
        message: 'Extension đã được cài đặt thành công. Click vào icon để khám phá các dịch vụ tài chính.',
        priority: 1
    });
}

// Tab updates - detect Home Credit pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        if (tab.url.includes('homecredit.vn')) {
            handleHomeCreditPageVisit(tabId, tab);
        }
    }
});

// Handle visits to Home Credit pages
function handleHomeCreditPageVisit(tabId, tab) {
    console.log('User visited Home Credit page:', tab.url);
    
    // Update badge to show user is on Home Credit site
    chrome.action.setBadgeText({ text: '●', tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId: tabId });
    
    // Inject helpful content script
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: enhanceHomeCreditPage
    });
    
    // Track visit
    trackPageVisit(tab.url);
}

// Function to inject into Home Credit pages
function enhanceHomeCreditPage() {
    // Add extension indicator
    if (!document.getElementById('hc-extension-indicator')) {
        const indicator = document.createElement('div');
        indicator.id = 'hc-extension-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #FF6B35, #F7931E);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                z-index: 9999;
                box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
                animation: slideIn 0.5s ease;
                cursor: pointer;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">
                🏠 Extension đang hoạt động
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(indicator);
        
        // Remove indicator after 3 seconds
        setTimeout(() => {
            const elem = document.getElementById('hc-extension-indicator');
            if (elem) {
                elem.style.animation = 'slideIn 0.5s ease reverse';
                setTimeout(() => elem.remove(), 500);
            }
        }, 3000);
    }
}

// Track page visits
function trackPageVisit(url) {
    chrome.storage.local.get(['pageVisits'], (result) => {
        const visits = result.pageVisits || [];
        
        visits.push({
            url: url,
            timestamp: new Date().toISOString(),
            domain: new URL(url).hostname
        });
        
        // Keep only last 50 visits
        if (visits.length > 50) {
            visits.splice(0, visits.length - 50);
        }
        
        chrome.storage.local.set({ pageVisits: visits });
    });
}

// Handle extension icon clicks
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked on tab:', tab.url);
    
    // Track click
    chrome.storage.local.get(['totalClicks'], (result) => {
        const clicks = (result.totalClicks || 0) + 1;
        chrome.storage.local.set({ totalClicks: clicks });
    });
});

// Alarm for periodic tasks
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyPromoCheck') {
        checkForNewPromotions();
    } else if (alarm.name === 'weeklyStats') {
        generateWeeklyStats();
    }
});

// Set up periodic alarms
chrome.alarms.create('dailyPromoCheck', { 
    delayInMinutes: 1, 
    periodInMinutes: 24 * 60 // Daily
});

chrome.alarms.create('weeklyStats', { 
    delayInMinutes: 60, 
    periodInMinutes: 7 * 24 * 60 // Weekly
});

// Check for new promotions
async function checkForNewPromotions() {
    try {
        // This would typically fetch from Home Credit API
        // For now, we'll simulate checking for promotions
        chrome.storage.local.get(['lastPromoCheck'], (result) => {
            const lastCheck = result.lastPromoCheck || 0;
            const now = Date.now();
            
            // Check if it's been more than 24 hours
            if (now - lastCheck > 24 * 60 * 60 * 1000) {
                // Simulate finding new promotion
                if (Math.random() > 0.7) { // 30% chance of new promo
                    showPromotionNotification();
                }
                
                chrome.storage.local.set({ lastPromoCheck: now });
            }
        });
    } catch (error) {
        console.error('Error checking promotions:', error);
    }
}

// Show promotion notification
function showPromotionNotification() {
    chrome.storage.local.get(['settings'], (result) => {
        const settings = result.settings || {};
        
        if (settings.notifications !== false) {
            chrome.notifications.create('newPromo', {
                type: 'basic',
                iconUrl: 'icons/icon-48.png',
                title: 'Khuyến mãi mới từ Home Credit! 🎉',
                message: 'Có ưu đãi hấp dẫn đang chờ bạn. Click để xem chi tiết!',
                priority: 1
            });
        }
    });
}

// Generate weekly stats
function generateWeeklyStats() {
    chrome.storage.local.get(['pageVisits', 'analytics'], (result) => {
        const visits = result.pageVisits || [];
        const analytics = result.analytics || [];
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weeklyVisits = visits.filter(visit => 
            new Date(visit.timestamp) > weekAgo
        );
        
        const weeklyActions = analytics.filter(action => 
            new Date(action.timestamp) > weekAgo
        );
        
        const stats = {
            weeklyVisits: weeklyVisits.length,
            weeklyActions: weeklyActions.length,
            mostVisitedPages: getMostVisitedPages(weeklyVisits),
            generatedAt: new Date().toISOString()
        };
        
        chrome.storage.local.set({ weeklyStats: stats });
        console.log('Weekly stats generated:', stats);
    });
}

// Helper function to get most visited pages
function getMostVisitedPages(visits) {
    const pageCounts = {};
    
    visits.forEach(visit => {
        const path = new URL(visit.url).pathname;
        pageCounts[path] = (pageCounts[path] || 0) + 1;
    });
    
    return Object.entries(pageCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
    if (notificationId === 'welcome') {
        chrome.tabs.create({ url: 'https://www.homecredit.vn/' });
    } else if (notificationId === 'newPromo') {
        chrome.tabs.create({ url: 'https://www.homecredit.vn/khuyen-mai' });
    }
    
    // Clear the notification
    chrome.notifications.clear(notificationId);
});

// Message handling from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'trackEvent') {
        trackEvent(request.eventName, request.data);
        sendResponse({ success: true });
    } else if (request.action === 'getStats') {
        getExtensionStats().then(stats => {
            sendResponse({ stats: stats });
        });
        return true; // Indicates we will send a response asynchronously
    } else if (request.action === 'openHomeCreditPage') {
        chrome.tabs.create({ url: request.url });
        sendResponse({ success: true });
    }
});

// Track events from other parts of extension
function trackEvent(eventName, data) {
    chrome.storage.local.get(['analytics'], (result) => {
        const analytics = result.analytics || [];
        
        analytics.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            source: 'background'
        });
        
        // Keep only last 200 events
        if (analytics.length > 200) {
            analytics.splice(0, analytics.length - 200);
        }
        
        chrome.storage.local.set({ analytics: analytics });
    });
}

// Get extension statistics
async function getExtensionStats() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['totalClicks', 'pageVisits', 'analytics', 'installDate'], (result) => {
            const stats = {
                totalClicks: result.totalClicks || 0,
                totalVisits: (result.pageVisits || []).length,
                totalEvents: (result.analytics || []).length,
                installDate: result.installDate,
                daysSinceInstall: result.installDate ? 
                    Math.floor((Date.now() - new Date(result.installDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
            };
            resolve(stats);
        });
    });
}

// Clear badge when tab is closed or changed
chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.action.setBadgeText({ text: '', tabId: tabId });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && !tab.url.includes('homecredit.vn')) {
            chrome.action.setBadgeText({ text: '', tabId: activeInfo.tabId });
        }
    });
});

console.log('Home Credit Extension background script loaded');
