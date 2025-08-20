// Content Script for Home Credit Extension
// This script runs on all pages and can interact with page content

(function() {
    'use strict';
    
    // Only run once
    if (window.homeCreditExtensionLoaded) {
        return;
    }
    window.homeCreditExtensionLoaded = true;
    
    // Content script loaded
    
    // Initialize content script
    init();
    
    function init() {
        // Check if this is a Home Credit page
        if (isHomeCreditPage()) {
            enhanceHomeCreditPage();
        } else {
            // Add floating Home Credit button on other sites
            addFloatingButton();
        }
        
        // Look for financial keywords and offer Home Credit alternatives
        detectFinancialContent();
        
        // Set up observers
        setupObservers();
    }
    
    function isHomeCreditPage() {
        return window.location.hostname.includes('homecredit.vn');
    }
    
    function enhanceHomeCreditPage() {
        // Enhancing Home Credit page
        
        // Add extension styles
        addExtensionStyles();
        
        // Improve form usability
        enhanceForms();
        
        // Add quick access toolbar
        addQuickAccessToolbar();
        
        // Track page performance
        trackPagePerformance();
    }
    
    function addExtensionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Home Credit Extension Enhancements */
            .hc-extension-highlight {
                border: 2px solid #FF6B35 !important;
                box-shadow: 0 0 10px rgba(255, 107, 53, 0.3) !important;
                transition: all 0.3s ease !important;
            }
            
            .hc-extension-toolbar {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                background: linear-gradient(135deg, #FF6B35, #F7931E);
                border-radius: 8px 0 0 8px;
                box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                transition: transform 0.3s ease;
            }
            
            .hc-extension-toolbar.collapsed {
                transform: translateY(-50%) translateX(calc(100% - 20px));
            }
            
            .hc-toolbar-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 4px;
                color: white;
                padding: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
                min-width: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .hc-toolbar-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
            }
            
            .hc-floating-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #FF6B35, #F7931E);
                border: none;
                border-radius: 50%;
                box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
                cursor: pointer;
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
                transition: all 0.3s ease;
                animation: pulse 2s infinite;
            }
            
            .hc-floating-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .hc-quick-form {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
                padding: 24px;
                z-index: 10000;
                max-width: 400px;
                width: 90%;
                display: none;
            }
            
            .hc-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    function enhanceForms() {
        // Find and enhance forms on Home Credit pages
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add auto-validation
            const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
            inputs.forEach(input => {
                input.addEventListener('blur', validateInput);
                input.addEventListener('focus', function() {
                    this.classList.add('hc-extension-highlight');
                });
                input.addEventListener('blur', function() {
                    this.classList.remove('hc-extension-highlight');
                });
            });
        });
    }
    
    function validateInput(event) {
        const input = event.target;
        const value = input.value.trim();
        
        // Basic validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showValidationMessage(input, 'Email không đúng định dạng');
            }
        }
        
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                showValidationMessage(input, 'Số điện thoại không đúng định dạng');
            }
        }
    }
    
    function showValidationMessage(input, message) {
        // Remove existing message
        const existingMsg = input.parentNode.querySelector('.hc-validation-msg');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Add new message
        const msgEl = document.createElement('div');
        msgEl.className = 'hc-validation-msg';
        msgEl.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 4px;
            animation: fadeIn 0.3s ease;
        `;
        msgEl.textContent = message;
        
        input.parentNode.insertBefore(msgEl, input.nextSibling);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (msgEl.parentNode) {
                msgEl.remove();
            }
        }, 3000);
    }
    
    function addQuickAccessToolbar() {
        if (document.getElementById('hc-extension-toolbar')) return;
        
        const toolbar = document.createElement('div');
        toolbar.id = 'hc-extension-toolbar';
        toolbar.className = 'hc-extension-toolbar';
        toolbar.innerHTML = `
            <button class="hc-toolbar-btn" title="Thu gọn/Mở rộng" onclick="this.parentNode.classList.toggle('collapsed')">
                ≡
            </button>
            <button class="hc-toolbar-btn" title="Trang chủ" onclick="window.location.href='https://www.homecredit.vn/'">
                🏠
            </button>
            <button class="hc-toolbar-btn" title="Vay tiền mặt" onclick="window.location.href='https://www.homecredit.vn/vay-tien-mat'">
                💰
            </button>
            <button class="hc-toolbar-btn" title="Thẻ tín dụng" onclick="window.location.href='https://www.homecredit.vn/the-tin-dung'">
                💳
            </button>
            <button class="hc-toolbar-btn" title="Khoản vay của tôi" onclick="window.location.href='https://www.homecredit.vn/khoan-vay-cua-toi'">
                📊
            </button>
            <button class="hc-toolbar-btn" title="Hỗ trợ" onclick="window.location.href='https://www.homecredit.vn/ho-tro'">
                ❓
            </button>
        `;
        
        document.body.appendChild(toolbar);
        
        // Auto-collapse after 5 seconds
        setTimeout(() => {
            toolbar.classList.add('collapsed');
        }, 5000);
    }
    
    function addFloatingButton() {
        if (document.getElementById('hc-floating-button') || isHomeCreditPage()) return;
        
        const button = document.createElement('button');
        button.id = 'hc-floating-button';
        button.className = 'hc-floating-button';
        button.innerHTML = '🏠';
        button.title = 'Home Credit - Giải pháp tài chính';
        
        button.addEventListener('click', showQuickForm);
        
        document.body.appendChild(button);
    }
    
    function showQuickForm() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'hc-overlay';
        overlay.addEventListener('click', hideQuickForm);
        
        // Create form
        const form = document.createElement('div');
        form.className = 'hc-quick-form';
        form.innerHTML = `
            <h3 style="color: #FF6B35; margin-bottom: 16px; text-align: center;">
                Home Credit Vietnam
            </h3>
            <p style="margin-bottom: 16px; text-align: center; color: #666;">
                Giải pháp tài chính nhanh chóng và tiện lợi
            </p>
            <div style="display: grid; gap: 12px;">
                <button onclick="window.open('https://www.homecredit.vn/vay-tien-mat', '_blank')" 
                        style="padding: 12px; border: none; background: #FF6B35; color: white; border-radius: 6px; cursor: pointer;">
                    💰 Vay tiền mặt - Duyệt nhanh 3 phút
                </button>
                <button onclick="window.open('https://www.homecredit.vn/the-tin-dung', '_blank')" 
                        style="padding: 12px; border: 1px solid #FF6B35; background: white; color: #FF6B35; border-radius: 6px; cursor: pointer;">
                    💳 Thẻ tín dụng - Hoàn tiền 10%
                </button>
                <button onclick="window.open('https://www.homecredit.vn/home-paylater', '_blank')" 
                        style="padding: 12px; border: 1px solid #FF6B35; background: white; color: #FF6B35; border-radius: 6px; cursor: pointer;">
                    📱 Home PayLater - Trả sau QR
                </button>
                <button onclick="window.open('https://www.homecredit.vn/', '_blank')" 
                        style="padding: 12px; border: 1px solid #ccc; background: white; color: #666; border-radius: 6px; cursor: pointer;">
                    🌐 Xem tất cả sản phẩm
                </button>
            </div>
            <button onclick="hideQuickForm()" 
                    style="position: absolute; top: 8px; right: 12px; border: none; background: none; font-size: 18px; cursor: pointer; color: #999;">
                ×
            </button>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(form);
        
        // Show with animation
        overlay.style.display = 'block';
        form.style.display = 'block';
        
        setTimeout(() => {
            overlay.style.opacity = '1';
            form.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // Track event
        trackEvent('floating_button_clicked');
    }
    
    function hideQuickForm() {
        const overlay = document.querySelector('.hc-overlay');
        const form = document.querySelector('.hc-quick-form');
        
        if (overlay) overlay.remove();
        if (form) form.remove();
    }
    
    // Make hideQuickForm global for onclick handlers
    window.hideQuickForm = hideQuickForm;
    
    function detectFinancialContent() {
        const financialKeywords = [
            'vay tiền', 'vay vốn', 'tín dụng', 'thẻ tín dụng', 'vay online',
            'lãi suất', 'ngân hàng', 'tài chính', 'cho vay', 'trả góp',
            'cashback', 'hoàn tiền', 'ưu đãi thẻ', 'mở thẻ'
        ];
        
        const textContent = document.body.textContent.toLowerCase();
        const foundKeywords = financialKeywords.filter(keyword => 
            textContent.includes(keyword)
        );
        
        if (foundKeywords.length > 0 && !isHomeCreditPage()) {
            // Show subtle Home Credit suggestion
            showFinancialSuggestion(foundKeywords);
        }
    }
    
    function showFinancialSuggestion(keywords) {
        // Only show once per page load
        if (document.getElementById('hc-financial-suggestion')) return;
        
        const suggestion = document.createElement('div');
        suggestion.id = 'hc-financial-suggestion';
        suggestion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FF6B35, #F7931E);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
            z-index: 9997;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.4;
            cursor: pointer;
            animation: slideInRight 0.5s ease;
        `;
        
        suggestion.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <strong>💡 Gợi ý từ Home Credit</strong><br>
                    <small>Tìm hiểu các sản phẩm tài chính ưu việt với lãi suất cạnh tranh</small>
                </div>
                <button onclick="this.parentNode.parentNode.remove()" 
                        style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; margin-left: 8px;">
                    ×
                </button>
            </div>
        `;
        
        suggestion.addEventListener('click', function(e) {
            if (e.target.tagName !== 'BUTTON') {
                window.open('https://www.homecredit.vn/', '_blank');
                this.remove();
            }
        });
        
        document.body.appendChild(suggestion);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (suggestion.parentNode) {
                suggestion.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => suggestion.remove(), 500);
            }
        }, 10000);
        
        // Track event
        trackEvent('financial_suggestion_shown', { keywords: keywords });
    }
    
    function setupObservers() {
        // Observe DOM changes to re-enhance new content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Re-enhance new forms
                            const newForms = node.querySelectorAll ? node.querySelectorAll('form') : [];
                            newForms.forEach(enhanceForm);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    function enhanceForm(form) {
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
        inputs.forEach(input => {
            if (!input.hasAttribute('data-hc-enhanced')) {
                input.addEventListener('blur', validateInput);
                input.setAttribute('data-hc-enhanced', 'true');
            }
        });
    }
    
    function trackPagePerformance() {
        // Track page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                trackEvent('page_performance', {
                    loadTime: loadTime,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                });
            }
        });
    }
    
    function trackEvent(eventName, data = {}) {
        // Send to background script
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'trackEvent',
                eventName: eventName,
                data: {
                    ...data,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                }
            }).catch(() => {
                // Ignore errors if extension context is invalidated
            });
        }
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'loadFeature') {
            loadFeature(request.featureName);
            sendResponse({ success: true });
        }
    });

    // Load feature dynamically
    function loadFeature(featureName) {
        // Check if feature already loaded
        if (document.querySelector(`script[data-feature="${featureName}"]`)) {
            return;
        }

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = chrome.runtime.getURL(`features/${featureName}.css`);
        cssLink.dataset.feature = featureName;
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL(`features/${featureName}.js`);
        script.dataset.feature = featureName;
        document.head.appendChild(script);

        // Auto-show feature after loading
        script.onload = () => {
            setTimeout(() => {
                const featureMap = {
                    'calculator': () => window.calculator?.show(),
                    'dashboard': () => window.dashboard?.show(),
                    'credit-score': () => window.creditScoreChecker?.show(),
                    'expense-tracker': () => window.expenseTracker?.show(),
                    'smart-notifications': () => window.smartNotifications?.show()
                };

                const showFunction = featureMap[featureName];
                if (showFunction) {
                    showFunction();
                }
            }, 100);
        };
        document.head.appendChild(script);

        // Feature loaded successfully
    }
    
    // Add global styles for animations
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(animationStyles);
    
    // Content script fully loaded
    
})();
