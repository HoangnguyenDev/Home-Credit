// Smart Notifications Feature
// Hệ thống thông báo thông minh với AI behavioral analysis

class SmartNotifications {
    constructor() {
        this.modal = null;
        this.notifications = [];
        this.settings = {
            enabled: true,
            quietHours: { start: '22:00', end: '08:00' },
            categories: {
                payment: true,
                promotion: true,
                tips: true,
                security: true
            },
            frequency: 'normal' // low, normal, high
        };
        this.behaviorData = {
            loginFrequency: 0,
            paymentHistory: [],
            productInterests: [],
            spendingPatterns: []
        };
        this.loadData();
        this.initNotificationSystem();
    }

    // Show notifications center
    show() {
        this.createModal();
        document.body.appendChild(this.modal);
        this.loadNotifications();
        this.updateSettings();
    }

    // Create notifications modal
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'hc-notifications-modal hc-extension-reset';
        modal.innerHTML = `
            <div class="hc-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="hc-modal-content">
                <div class="hc-modal-header">
                    <h3>🔔 Trung Tâm Thông Báo</h3>
                    <button class="hc-close-btn" onclick="this.closest('.hc-notifications-modal').remove()">×</button>
                </div>

                <div class="hc-notification-tabs">
                    <button class="hc-tab-btn active" data-tab="notifications">Thông báo</button>
                    <button class="hc-tab-btn" data-tab="settings">Cài đặt</button>
                    <button class="hc-tab-btn" data-tab="insights">Thống kê</button>
                </div>

                <!-- Notifications Tab -->
                <div class="hc-tab-content active" id="notifications-tab">
                    <div class="hc-notification-filters">
                        <button class="hc-filter-btn active" data-filter="all">Tất cả</button>
                        <button class="hc-filter-btn" data-filter="unread">Chưa đọc <span class="hc-badge" id="unread-count">0</span></button>
                        <button class="hc-filter-btn" data-filter="important">Quan trọng</button>
                        <button class="hc-filter-btn" data-filter="today">Hôm nay</button>
                    </div>

                    <div class="hc-notifications-list" id="notifications-list">
                        <!-- Notifications will be populated here -->
                    </div>

                    <div class="hc-notifications-actions">
                        <button class="hc-btn-secondary" onclick="window.smartNotifications.markAllAsRead()">
                            ✅ Đánh dấu tất cả đã đọc
                        </button>
                        <button class="hc-btn-secondary" onclick="window.smartNotifications.clearAll()">
                            🗑️ Xóa tất cả
                        </button>
                    </div>
                </div>

                <!-- Settings Tab -->
                <div class="hc-tab-content" id="settings-tab">
                    <div class="hc-settings-section">
                        <h4>🔧 Cài đặt thông báo</h4>
                        
                        <div class="hc-setting-item">
                            <label class="hc-toggle">
                                <input type="checkbox" id="notifications-enabled" ${this.settings.enabled ? 'checked' : ''}>
                                <span class="hc-toggle-slider"></span>
                            </label>
                            <div class="hc-setting-info">
                                <div class="hc-setting-title">Bật thông báo</div>
                                <div class="hc-setting-desc">Nhận thông báo từ Home Credit Extension</div>
                            </div>
                        </div>

                        <div class="hc-setting-item">
                            <div class="hc-setting-info">
                                <div class="hc-setting-title">Giờ yên tĩnh</div>
                                <div class="hc-setting-desc">Không nhận thông báo trong khoảng thời gian này</div>
                                <div class="hc-time-range">
                                    <input type="time" id="quiet-start" value="${this.settings.quietHours.start}">
                                    <span>đến</span>
                                    <input type="time" id="quiet-end" value="${this.settings.quietHours.end}">
                                </div>
                            </div>
                        </div>

                        <div class="hc-setting-item">
                            <div class="hc-setting-info">
                                <div class="hc-setting-title">Tần suất thông báo</div>
                                <div class="hc-setting-desc">Điều chỉnh số lượng thông báo nhận được</div>
                                <select id="notification-frequency">
                                    <option value="low" ${this.settings.frequency === 'low' ? 'selected' : ''}>Ít (chỉ quan trọng)</option>
                                    <option value="normal" ${this.settings.frequency === 'normal' ? 'selected' : ''}>Bình thường</option>
                                    <option value="high" ${this.settings.frequency === 'high' ? 'selected' : ''}>Nhiều (tất cả)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="hc-settings-section">
                        <h4>📂 Loại thông báo</h4>
                        
                        <div class="hc-category-settings">
                            <div class="hc-category-item">
                                <label class="hc-toggle">
                                    <input type="checkbox" data-category="payment" ${this.settings.categories.payment ? 'checked' : ''}>
                                    <span class="hc-toggle-slider"></span>
                                </label>
                                <div class="hc-category-info">
                                    <span class="hc-category-icon">💳</span>
                                    <div>
                                        <div class="hc-category-name">Thanh toán & Vay</div>
                                        <div class="hc-category-desc">Nhắc nhở thanh toán, cơ hội vay mới</div>
                                    </div>
                                </div>
                            </div>

                            <div class="hc-category-item">
                                <label class="hc-toggle">
                                    <input type="checkbox" data-category="promotion" ${this.settings.categories.promotion ? 'checked' : ''}>
                                    <span class="hc-toggle-slider"></span>
                                </label>
                                <div class="hc-category-info">
                                    <span class="hc-category-icon">🎉</span>
                                    <div>
                                        <div class="hc-category-name">Khuyến mãi & Ưu đãi</div>
                                        <div class="hc-category-desc">Chương trình khuyến mãi, cashback</div>
                                    </div>
                                </div>
                            </div>

                            <div class="hc-category-item">
                                <label class="hc-toggle">
                                    <input type="checkbox" data-category="tips" ${this.settings.categories.tips ? 'checked' : ''}>
                                    <span class="hc-toggle-slider"></span>
                                </label>
                                <div class="hc-category-info">
                                    <span class="hc-category-icon">💡</span>
                                    <div>
                                        <div class="hc-category-name">Mẹo tài chính</div>
                                        <div class="hc-category-desc">Gợi ý tiết kiệm, đầu tư thông minh</div>
                                    </div>
                                </div>
                            </div>

                            <div class="hc-category-item">
                                <label class="hc-toggle">
                                    <input type="checkbox" data-category="security" ${this.settings.categories.security ? 'checked' : ''}>
                                    <span class="hc-toggle-slider"></span>
                                </label>
                                <div class="hc-category-info">
                                    <span class="hc-category-icon">🔒</span>
                                    <div>
                                        <div class="hc-category-name">Bảo mật & Cảnh báo</div>
                                        <div class="hc-category-desc">Cảnh báo gian lận, bảo mật tài khoản</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="hc-settings-actions">
                        <button class="hc-btn-primary" onclick="window.smartNotifications.saveSettings()">
                            💾 Lưu cài đặt
                        </button>
                        <button class="hc-btn-secondary" onclick="window.smartNotifications.resetSettings()">
                            🔄 Đặt lại mặc định
                        </button>
                    </div>
                </div>

                <!-- Insights Tab -->
                <div class="hc-tab-content" id="insights-tab">
                    <div class="hc-insights-overview">
                        <h4>📊 Thống kê thông báo</h4>
                        
                        <div class="hc-stats-grid">
                            <div class="hc-stat-card">
                                <div class="hc-stat-value" id="total-notifications">0</div>
                                <div class="hc-stat-label">Tổng thông báo</div>
                            </div>
                            <div class="hc-stat-card">
                                <div class="hc-stat-value" id="read-rate">0%</div>
                                <div class="hc-stat-label">Tỷ lệ đọc</div>
                            </div>
                            <div class="hc-stat-card">
                                <div class="hc-stat-value" id="avg-daily">0</div>
                                <div class="hc-stat-label">Trung bình/ngày</div>
                            </div>
                        </div>
                    </div>

                    <div class="hc-behavior-insights">
                        <h4>🧠 Phân tích hành vi</h4>
                        <div id="behavior-analysis">
                            <!-- Behavior insights will be populated here -->
                        </div>
                    </div>

                    <div class="hc-recommendations">
                        <h4>🎯 Đề xuất cá nhân hóa</h4>
                        <div id="personal-recommendations">
                            <!-- Recommendations will be populated here -->
                        </div>
                    </div>
                </div>

                <div class="hc-modal-footer">
                    <div class="hc-notification-info">
                        <small>
                            🔔 Hệ thống thông báo thông minh sử dụng AI để cá nhân hóa trải nghiệm của bạn.
                            Dữ liệu được bảo mật và chỉ lưu trữ cục bộ.
                        </small>
                    </div>
                </div>
            </div>
        `;

        this.modal = modal;
        this.setupTabSwitching();
        this.setupEventListeners();
        this.setupFilterButtons();
    }

    // Setup tab switching
    setupTabSwitching() {
        const tabBtns = this.modal.querySelectorAll('.hc-tab-btn');
        const tabContents = this.modal.querySelectorAll('.hc-tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(targetTab + '-tab').classList.add('active');

                // Load data for specific tabs
                if (targetTab === 'insights') {
                    this.updateInsights();
                }
            });
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Settings event listeners
        const enabledToggle = this.modal.querySelector('#notifications-enabled');
        enabledToggle.addEventListener('change', () => {
            this.settings.enabled = enabledToggle.checked;
        });

        const frequencySelect = this.modal.querySelector('#notification-frequency');
        frequencySelect.addEventListener('change', () => {
            this.settings.frequency = frequencySelect.value;
        });

        const quietStart = this.modal.querySelector('#quiet-start');
        const quietEnd = this.modal.querySelector('#quiet-end');
        
        quietStart.addEventListener('change', () => {
            this.settings.quietHours.start = quietStart.value;
        });
        
        quietEnd.addEventListener('change', () => {
            this.settings.quietHours.end = quietEnd.value;
        });

        // Category toggles
        const categoryToggles = this.modal.querySelectorAll('[data-category]');
        categoryToggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                const category = toggle.dataset.category;
                this.settings.categories[category] = toggle.checked;
            });
        });
    }

    // Setup filter buttons
    setupFilterButtons() {
        const filterBtns = this.modal.querySelectorAll('.hc-filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                this.filterNotifications(filter);
            });
        });
    }

    // Initialize notification system
    initNotificationSystem() {
        this.generateSmartNotifications();
        this.scheduleNotificationCheck();
    }

    // Generate smart notifications based on user behavior
    generateSmartNotifications() {
        const now = new Date();
        const notifications = [];

        // Payment reminders based on spending patterns
        if (this.behaviorData.spendingPatterns.length > 0) {
            const avgSpending = this.behaviorData.spendingPatterns.reduce((a, b) => a + b, 0) / this.behaviorData.spendingPatterns.length;
            if (avgSpending > 5000000) { // 5M VND
                notifications.push({
                    id: 'payment_reminder_' + Date.now(),
                    type: 'payment',
                    priority: 'high',
                    title: '💳 Nhắc nhở thanh toán',
                    message: 'Đến hạn thanh toán thẻ tín dụng trong 3 ngày. Thanh toán đúng hạn để tránh phí trễ hạn.',
                    timestamp: now.toISOString(),
                    read: false,
                    actionUrl: 'https://www.homecredit.vn/khoan-vay-cua-toi'
                });
            }
        }

        // Personalized promotions
        if (this.behaviorData.productInterests.includes('credit-card')) {
            notifications.push({
                id: 'promo_credit_' + Date.now(),
                type: 'promotion',
                priority: 'medium',
                title: '🎉 Ưu đãi đặc biệt cho bạn',
                message: 'Thẻ tín dụng Home Credit hoàn tiền 15% cho đơn hàng đầu tiên. Chỉ còn 2 ngày!',
                timestamp: now.toISOString(),
                read: false,
                actionUrl: 'https://www.homecredit.vn/the-tin-dung'
            });
        }

        // Financial tips based on behavior
        notifications.push({
            id: 'tip_savings_' + Date.now(),
            type: 'tips',
            priority: 'low',
            title: '💡 Mẹo tiết kiệm cho bạn',
            message: 'Dựa trên thói quen chi tiêu, bạn có thể tiết kiệm 500.000đ/tháng bằng cách giảm 20% chi tiêu ăn uống.',
            timestamp: now.toISOString(),
            read: false
        });

        // Security alerts
        notifications.push({
            id: 'security_' + Date.now(),
            type: 'security',
            priority: 'high',
            title: '🔒 Cảnh báo bảo mật',
            message: 'Phát hiện đăng nhập từ thiết bị mới. Nếu không phải bạn, hãy đổi mật khẩu ngay.',
            timestamp: now.toISOString(),
            read: false,
            actionUrl: 'https://www.homecredit.vn/doi-mat-khau'
        });

        // Add to notifications list
        this.notifications = [...notifications, ...this.notifications];
        this.saveData();
    }

    // Load notifications into UI
    loadNotifications() {
        const container = document.getElementById('notifications-list');
        if (!container) return;

        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="hc-empty-notifications">
                    <div class="hc-empty-icon">🔔</div>
                    <div class="hc-empty-title">Chưa có thông báo nào</div>
                    <div class="hc-empty-desc">Thông báo mới sẽ xuất hiện ở đây</div>
                </div>
            `;
            return;
        }

        const sortedNotifications = [...this.notifications].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        container.innerHTML = sortedNotifications.map(notification => {
            const timeAgo = this.getTimeAgo(notification.timestamp);
            const priorityClass = `hc-priority-${notification.priority}`;
            const readClass = notification.read ? 'hc-read' : 'hc-unread';
            
            return `
                <div class="hc-notification-item ${priorityClass} ${readClass}" data-id="${notification.id}">
                    <div class="hc-notification-content" onclick="window.smartNotifications.markAsRead('${notification.id}')">
                        <div class="hc-notification-header">
                            <span class="hc-notification-title">${notification.title}</span>
                            <span class="hc-notification-time">${timeAgo}</span>
                        </div>
                        <div class="hc-notification-message">${notification.message}</div>
                        ${notification.actionUrl ? `
                            <button class="hc-notification-action" onclick="window.smartNotifications.openNotificationUrl('${notification.actionUrl}')">
                                Xem chi tiết →
                            </button>
                        ` : ''}
                    </div>
                    <button class="hc-notification-delete" onclick="window.smartNotifications.deleteNotification('${notification.id}')">
                        ×
                    </button>
                </div>
            `;
        }).join('');

        // Update unread count
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const unreadBadge = document.getElementById('unread-count');
        if (unreadBadge) {
            unreadBadge.textContent = unreadCount;
        }
    }

    // Filter notifications
    filterNotifications(filter) {
        const items = this.modal.querySelectorAll('.hc-notification-item');
        const today = new Date().toDateString();

        items.forEach(item => {
            const notification = this.notifications.find(n => n.id === item.dataset.id);
            let show = true;

            switch (filter) {
                case 'unread':
                    show = !notification.read;
                    break;
                case 'important':
                    show = notification.priority === 'high';
                    break;
                case 'today':
                    show = new Date(notification.timestamp).toDateString() === today;
                    break;
                default:
                    show = true;
            }

            item.style.display = show ? 'block' : 'none';
        });
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            this.saveData();
            
            // Update UI
            const item = this.modal.querySelector(`[data-id="${notificationId}"]`);
            if (item) {
                item.classList.remove('hc-unread');
                item.classList.add('hc-read');
            }

            // Update unread count
            const unreadCount = this.notifications.filter(n => !n.read).length;
            const unreadBadge = document.getElementById('unread-count');
            if (unreadBadge) {
                unreadBadge.textContent = unreadCount;
            }
        }
    }

    // Mark all as read
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveData();
        this.loadNotifications();
        this.showNotification('✅ Đã đánh dấu tất cả thông báo là đã đọc');
    }

    // Delete notification
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveData();
        
        const item = this.modal.querySelector(`[data-id="${notificationId}"]`);
        if (item) {
            item.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (item.parentNode) {
                    item.parentNode.removeChild(item);
                }
            }, 300);
        }
    }

    // Clear all notifications
    clearAll() {
        if (confirm('Bạn có chắc muốn xóa tất cả thông báo?')) {
            this.notifications = [];
            this.saveData();
            this.loadNotifications();
            this.showNotification('🗑️ Đã xóa tất cả thông báo');
        }
    }

    // Open notification URL
    openNotificationUrl(url) {
        if (chrome && chrome.tabs) {
            chrome.tabs.create({ url: url });
        } else {
            window.open(url, '_blank');
        }
        this.trackEvent('notification_action_clicked', { url: url });
    }

    // Save settings
    saveSettings() {
        this.saveData();
        this.showNotification('✅ Đã lưu cài đặt thông báo');
        this.trackEvent('notification_settings_saved');
    }

    // Reset settings
    resetSettings() {
        this.settings = {
            enabled: true,
            quietHours: { start: '22:00', end: '08:00' },
            categories: {
                payment: true,
                promotion: true,
                tips: true,
                security: true
            },
            frequency: 'normal'
        };
        this.saveData();
        this.updateSettings();
        this.showNotification('🔄 Đã đặt lại cài đặt mặc định');
    }

    // Update settings UI
    updateSettings() {
        const enabledToggle = this.modal.querySelector('#notifications-enabled');
        const frequencySelect = this.modal.querySelector('#notification-frequency');
        const quietStart = this.modal.querySelector('#quiet-start');
        const quietEnd = this.modal.querySelector('#quiet-end');

        if (enabledToggle) enabledToggle.checked = this.settings.enabled;
        if (frequencySelect) frequencySelect.value = this.settings.frequency;
        if (quietStart) quietStart.value = this.settings.quietHours.start;
        if (quietEnd) quietEnd.value = this.settings.quietHours.end;

        // Update category toggles
        Object.keys(this.settings.categories).forEach(category => {
            const toggle = this.modal.querySelector(`[data-category="${category}"]`);
            if (toggle) {
                toggle.checked = this.settings.categories[category];
            }
        });
    }

    // Update insights
    updateInsights() {
        // Update stats
        const totalEl = document.getElementById('total-notifications');
        const readRateEl = document.getElementById('read-rate');
        const avgDailyEl = document.getElementById('avg-daily');

        if (totalEl) totalEl.textContent = this.notifications.length;
        
        if (readRateEl) {
            const readCount = this.notifications.filter(n => n.read).length;
            const readRate = this.notifications.length > 0 ? 
                Math.round((readCount / this.notifications.length) * 100) : 0;
            readRateEl.textContent = readRate + '%';
        }

        if (avgDailyEl) {
            // Calculate average notifications per day over last 30 days
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const recentNotifications = this.notifications.filter(n => 
                new Date(n.timestamp) > thirtyDaysAgo
            );
            const avgDaily = Math.round(recentNotifications.length / 30 * 10) / 10;
            avgDailyEl.textContent = avgDaily;
        }

        // Generate behavior analysis
        this.generateBehaviorAnalysis();
        this.generatePersonalRecommendations();
    }

    // Generate behavior analysis
    generateBehaviorAnalysis() {
        const container = document.getElementById('behavior-analysis');
        if (!container) return;

        const insights = [];

        // Notification engagement analysis
        const readRate = this.notifications.length > 0 ? 
            (this.notifications.filter(n => n.read).length / this.notifications.length) * 100 : 0;

        if (readRate > 80) {
            insights.push({
                type: 'positive',
                title: '📖 Người dùng tích cực',
                message: `Bạn đọc ${readRate.toFixed(1)}% thông báo, cho thấy mức độ quan tâm cao đến thông tin tài chính.`
            });
        } else if (readRate < 30) {
            insights.push({
                type: 'warning',
                title: '👀 Cần cải thiện engagement',
                message: `Tỷ lệ đọc thông báo chỉ ${readRate.toFixed(1)}%. Hãy điều chỉnh cài đặt để nhận thông báo phù hợp hơn.`
            });
        }

        // Category preference analysis
        const categoryStats = {};
        this.notifications.forEach(n => {
            categoryStats[n.type] = (categoryStats[n.type] || 0) + (n.read ? 1 : 0);
        });

        const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];
        if (topCategory) {
            const categoryNames = {
                payment: 'thanh toán',
                promotion: 'khuyến mãi',
                tips: 'mẹo tài chính',
                security: 'bảo mật'
            };
            
            insights.push({
                type: 'info',
                title: '📊 Sở thích nội dung',
                message: `Bạn quan tâm nhất đến thông báo về ${categoryNames[topCategory[0]] || topCategory[0]}.`
            });
        }

        container.innerHTML = insights.map(insight => `
            <div class="hc-insight-item ${insight.type}">
                <div class="hc-insight-title">${insight.title}</div>
                <div class="hc-insight-message">${insight.message}</div>
            </div>
        `).join('');
    }

    // Generate personal recommendations
    generatePersonalRecommendations() {
        const container = document.getElementById('personal-recommendations');
        if (!container) return;

        const recommendations = [];

        // Time-based recommendations
        const now = new Date();
        const hour = now.getHours();

        if (hour >= 9 && hour <= 17) {
            recommendations.push({
                icon: '💼',
                title: 'Giờ làm việc',
                message: 'Đây là thời gian tốt để kiểm tra các cơ hội vay ưu đãi cho doanh nghiệp.',
                action: 'Xem sản phẩm vay'
            });
        } else if (hour >= 18 && hour <= 22) {
            recommendations.push({
                icon: '🍽️',
                title: 'Giờ tối',
                message: 'Thời điểm lý tưởng để lên kế hoạch chi tiêu và ngân sách cho tuần tới.',
                action: 'Mở công cụ ngân sách'
            });
        }

        // Product recommendations based on behavior
        if (this.behaviorData.productInterests.length === 0) {
            recommendations.push({
                icon: '🎯',
                title: 'Khám phá sản phẩm',
                message: 'Hãy tìm hiểu các sản phẩm Home Credit phù hợp với nhu cầu tài chính của bạn.',
                action: 'Xem tất cả sản phẩm'
            });
        }

        // Financial health recommendations
        recommendations.push({
            icon: '📈',
            title: 'Cải thiện sức khỏe tài chính',
            message: 'Sử dụng công cụ theo dõi chi tiêu để quản lý tài chính hiệu quả hơn.',
            action: 'Mở theo dõi chi tiêu'
        });

        container.innerHTML = recommendations.map(rec => `
            <div class="hc-recommendation-item">
                <div class="hc-rec-icon">${rec.icon}</div>
                <div class="hc-rec-content">
                    <div class="hc-rec-title">${rec.title}</div>
                    <div class="hc-rec-message">${rec.message}</div>
                </div>
                <button class="hc-rec-action">${rec.action}</button>
            </div>
        `).join('');
    }

    // Schedule notification check
    scheduleNotificationCheck() {
        // Check for new notifications every hour
        setInterval(() => {
            this.checkForSmartNotifications();
        }, 60 * 60 * 1000);
    }

    // Check for smart notifications based on current context
    checkForSmartNotifications() {
        if (!this.settings.enabled) return;
        if (this.isQuietHours()) return;

        // Check if user is on financial websites
        const currentUrl = window.location.hostname;
        const financialSites = ['vietcombank.com.vn', 'techcombank.com.vn', 'tpb.vn'];
        
        if (financialSites.some(site => currentUrl.includes(site))) {
            this.sendContextualNotification();
        }
    }

    // Check if current time is in quiet hours
    isQuietHours() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const [startHour, startMin] = this.settings.quietHours.start.split(':').map(Number);
        const [endHour, endMin] = this.settings.quietHours.end.split(':').map(Number);
        
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        if (startTime > endTime) {
            // Overnight quiet hours (e.g., 22:00 to 08:00)
            return currentTime >= startTime || currentTime <= endTime;
        } else {
            // Same day quiet hours
            return currentTime >= startTime && currentTime <= endTime;
        }
    }

    // Send contextual notification
    sendContextualNotification() {
        const notification = {
            id: 'contextual_' + Date.now(),
            type: 'tips',
            priority: 'medium',
            title: '💡 Gợi ý từ Home Credit',
            message: 'Đang tìm hiểu sản phẩm ngân hàng? So sánh với Home Credit để có lựa chọn tốt nhất!',
            timestamp: new Date().toISOString(),
            read: false,
            actionUrl: 'https://www.homecredit.vn/so-sanh-san-pham'
        };

        this.notifications.unshift(notification);
        this.saveData();
        
        // Show browser notification if allowed
        this.showBrowserNotification(notification);
    }

    // Show browser notification
    showBrowserNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: chrome.runtime.getURL('icons/icon-48.png'),
                badge: chrome.runtime.getURL('icons/icon-16.png')
            });
        }
    }

    // Get time ago string
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
        
        return time.toLocaleDateString('vi-VN');
    }

    // Load data from storage
    loadData() {
        if (chrome && chrome.storage) {
            chrome.storage.local.get(['notifications', 'notificationSettings', 'behaviorData'], (result) => {
                this.notifications = result.notifications || [];
                this.settings = { ...this.settings, ...result.notificationSettings };
                this.behaviorData = { ...this.behaviorData, ...result.behaviorData };
            });
        } else {
            // Fallback to localStorage
            const notifications = localStorage.getItem('hc_notifications');
            const settings = localStorage.getItem('hc_notification_settings');
            const behavior = localStorage.getItem('hc_behavior_data');
            
            if (notifications) this.notifications = JSON.parse(notifications);
            if (settings) this.settings = { ...this.settings, ...JSON.parse(settings) };
            if (behavior) this.behaviorData = { ...this.behaviorData, ...JSON.parse(behavior) };
        }
    }

    // Save data to storage
    saveData() {
        const data = {
            notifications: this.notifications,
            notificationSettings: this.settings,
            behaviorData: this.behaviorData
        };

        if (chrome && chrome.storage) {
            chrome.storage.local.set(data);
        } else {
            localStorage.setItem('hc_notifications', JSON.stringify(this.notifications));
            localStorage.setItem('hc_notification_settings', JSON.stringify(this.settings));
            localStorage.setItem('hc_behavior_data', JSON.stringify(this.behaviorData));
        }
    }

    // Track events
    trackEvent(eventName, data = {}) {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'trackEvent',
                eventName: eventName,
                data: { source: 'smart_notifications', ...data }
            });
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `hc-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#F44336' : '#4CAF50'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            z-index: 10002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.smartNotifications = new SmartNotifications();
}
