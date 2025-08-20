// Financial Health Dashboard Feature
// Provides comprehensive financial health analysis and recommendations

class FinancialHealthDashboard {
    constructor() {
        this.userData = null;
        this.healthScore = 0;
        this.recommendations = [];
        this.loadUserData();
    }

    // Load user financial data from storage
    async loadUserData() {
        if (chrome && chrome.storage) {
            const result = await chrome.storage.local.get(['financialData']);
            this.userData = result.financialData || this.getDefaultData();
        } else {
            this.userData = this.getDefaultData();
        }
        this.calculateHealthScore();
    }

    // Get default financial data structure
    getDefaultData() {
        return {
            income: {
                monthly: 0,
                sources: ['salary'],
                stable: true
            },
            expenses: {
                monthly: 0,
                categories: {
                    housing: 0,
                    food: 0,
                    transportation: 0,
                    utilities: 0,
                    entertainment: 0,
                    debt: 0,
                    savings: 0,
                    other: 0
                }
            },
            debts: {
                total: 0,
                items: []
            },
            savings: {
                emergency: 0,
                investment: 0,
                goals: []
            },
            goals: {
                shortTerm: [],
                longTerm: []
            },
            lastUpdated: new Date().toISOString()
        };
    }

    // Calculate financial health score (0-100)
    calculateHealthScore() {
        let score = 0;
        const weights = {
            debtToIncome: 25,
            emergencyFund: 20,
            savingsRate: 20,
            expenseRatio: 15,
            diversification: 10,
            goals: 10
        };

        // Debt-to-income ratio (lower is better)
        const debtToIncomeRatio = this.userData.debts.total / (this.userData.income.monthly * 12);
        if (debtToIncomeRatio <= 0.2) score += weights.debtToIncome;
        else if (debtToIncomeRatio <= 0.36) score += weights.debtToIncome * 0.7;
        else if (debtToIncomeRatio <= 0.5) score += weights.debtToIncome * 0.4;

        // Emergency fund (3-6 months of expenses)
        const monthlyExpenses = this.userData.expenses.monthly;
        const emergencyMonths = this.userData.savings.emergency / monthlyExpenses;
        if (emergencyMonths >= 6) score += weights.emergencyFund;
        else if (emergencyMonths >= 3) score += weights.emergencyFund * 0.8;
        else if (emergencyMonths >= 1) score += weights.emergencyFund * 0.5;

        // Savings rate (income - expenses) / income
        const savingsRate = (this.userData.income.monthly - this.userData.expenses.monthly) / this.userData.income.monthly;
        if (savingsRate >= 0.2) score += weights.savingsRate;
        else if (savingsRate >= 0.1) score += weights.savingsRate * 0.7;
        else if (savingsRate >= 0.05) score += weights.savingsRate * 0.4;

        // Expense ratio control
        const expenseRatio = this.userData.expenses.monthly / this.userData.income.monthly;
        if (expenseRatio <= 0.5) score += weights.expenseRatio;
        else if (expenseRatio <= 0.7) score += weights.expenseRatio * 0.7;
        else if (expenseRatio <= 0.8) score += weights.expenseRatio * 0.4;

        // Income diversification
        if (this.userData.income.sources.length > 1) score += weights.diversification;
        else if (this.userData.income.stable) score += weights.diversification * 0.5;

        // Financial goals
        const totalGoals = this.userData.goals.shortTerm.length + this.userData.goals.longTerm.length;
        if (totalGoals >= 3) score += weights.goals;
        else if (totalGoals >= 1) score += weights.goals * 0.6;

        this.healthScore = Math.round(score);
        this.generateRecommendations();
    }

    // Generate personalized recommendations
    generateRecommendations() {
        this.recommendations = [];

        const debtToIncomeRatio = this.userData.debts.total / (this.userData.income.monthly * 12);
        const emergencyMonths = this.userData.savings.emergency / this.userData.expenses.monthly;
        const savingsRate = (this.userData.income.monthly - this.userData.expenses.monthly) / this.userData.income.monthly;

        // Debt recommendations
        if (debtToIncomeRatio > 0.36) {
            this.recommendations.push({
                type: 'debt',
                priority: 'high',
                title: 'Giảm nợ khẩn cấp',
                description: 'Tỷ lệ nợ/thu nhập của bạn cao. Hãy ưu tiên trả nợ lãi suất cao trước.',
                action: 'debt_consolidation',
                icon: '🚨'
            });
        }

        // Emergency fund recommendations
        if (emergencyMonths < 3) {
            this.recommendations.push({
                type: 'emergency',
                priority: 'high',
                title: 'Xây dựng quỹ khẩn cấp',
                description: `Hãy tiết kiệm ${this.formatCurrency((3 * this.userData.expenses.monthly) - this.userData.savings.emergency)} để có quỹ khẩn cấp 3 tháng.`,
                action: 'emergency_fund',
                icon: '🛡️'
            });
        }

        // Savings recommendations
        if (savingsRate < 0.1) {
            this.recommendations.push({
                type: 'savings',
                priority: 'medium',
                title: 'Tăng tỷ lệ tiết kiệm',
                description: 'Mục tiêu tiết kiệm ít nhất 10% thu nhập hàng tháng.',
                action: 'savings_plan',
                icon: '💰'
            });
        }

        // Investment recommendations
        if (this.userData.savings.investment === 0 && emergencyMonths >= 3) {
            this.recommendations.push({
                type: 'investment',
                priority: 'medium',
                title: 'Bắt đầu đầu tư',
                description: 'Bạn đã có quỹ khẩn cấp. Hãy xem xét đầu tư để tăng tài sản.',
                action: 'investment_start',
                icon: '📈'
            });
        }

        // Home Credit specific recommendations
        if (debtToIncomeRatio < 0.3 && this.userData.income.monthly > 15000000) {
            this.recommendations.push({
                type: 'product',
                priority: 'low',
                title: 'Thẻ tín dụng Home Credit',
                description: 'Bạn đủ điều kiện đăng ký thẻ tín dụng với nhiều ưu đãi.',
                action: 'credit_card_apply',
                icon: '💳'
            });
        }

        // Sort by priority
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        this.recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    // Create dashboard modal
    createDashboardModal() {
        const modal = document.createElement('div');
        modal.className = 'hc-dashboard-modal hc-extension-reset';
        modal.innerHTML = `
            <div class="hc-dashboard-overlay" onclick="this.parentElement.remove()"></div>
            <div class="hc-dashboard-content">
                <div class="hc-dashboard-header">
                    <h3>📊 Tình Hình Tài Chính Của Bạn</h3>
                    <button class="hc-close-btn" onclick="this.closest('.hc-dashboard-modal').remove()">×</button>
                </div>

                <div class="hc-dashboard-tabs">
                    <button class="hc-tab-btn active" data-tab="overview">Tổng quan</button>
                    <button class="hc-tab-btn" data-tab="analysis">Phân tích</button>
                    <button class="hc-tab-btn" data-tab="recommendations">Khuyến nghị</button>
                    <button class="hc-tab-btn" data-tab="goals">Mục tiêu</button>
                </div>

                <div class="hc-tab-content active" id="overview-tab">
                    ${this.createOverviewTab()}
                </div>

                <div class="hc-tab-content" id="analysis-tab">
                    ${this.createAnalysisTab()}
                </div>

                <div class="hc-tab-content" id="recommendations-tab">
                    ${this.createRecommendationsTab()}
                </div>

                <div class="hc-tab-content" id="goals-tab">
                    ${this.createGoalsTab()}
                </div>

                <div class="hc-dashboard-footer">
                    <button class="hc-update-data-btn" onclick="window.financialDashboard.showDataForm()">
                        📝 Cập nhật thông tin tài chính
                    </button>
                </div>
            </div>
        `;

        return modal;
    }

    // Create overview tab content
    createOverviewTab() {
        const scoreColor = this.getScoreColor(this.healthScore);
        const scoreEmoji = this.getScoreEmoji(this.healthScore);
        
        return `
            <div class="hc-health-score-card">
                <div class="hc-score-circle" style="border-color: ${scoreColor}">
                    <span class="hc-score-emoji">${scoreEmoji}</span>
                    <span class="hc-score-number" style="color: ${scoreColor}">${this.healthScore}</span>
                    <span class="hc-score-label">Điểm sức khỏe tài chính</span>
                </div>
                <div class="hc-score-description">
                    <h4>${this.getScoreDescription(this.healthScore)}</h4>
                    <p>${this.getScoreAdvice(this.healthScore)}</p>
                </div>
            </div>

            <div class="hc-overview-grid">
                <div class="hc-overview-card">
                    <div class="hc-card-icon">💵</div>
                    <div class="hc-card-content">
                        <div class="hc-card-title">Thu nhập tháng</div>
                        <div class="hc-card-value">${this.formatCurrency(this.userData.income.monthly)}</div>
                    </div>
                </div>

                <div class="hc-overview-card">
                    <div class="hc-card-icon">💸</div>
                    <div class="hc-card-content">
                        <div class="hc-card-title">Chi tiêu tháng</div>
                        <div class="hc-card-value">${this.formatCurrency(this.userData.expenses.monthly)}</div>
                    </div>
                </div>

                <div class="hc-overview-card">
                    <div class="hc-card-icon">💰</div>
                    <div class="hc-card-content">
                        <div class="hc-card-title">Tiết kiệm tháng</div>
                        <div class="hc-card-value">${this.formatCurrency(this.userData.income.monthly - this.userData.expenses.monthly)}</div>
                    </div>
                </div>

                <div class="hc-overview-card">
                    <div class="hc-card-icon">🔒</div>
                    <div class="hc-card-content">
                        <div class="hc-card-title">Quỹ khẩn cấp</div>
                        <div class="hc-card-value">${this.formatCurrency(this.userData.savings.emergency)}</div>
                    </div>
                </div>

                <div class="hc-overview-card">
                    <div class="hc-card-icon">📈</div>
                    <div class="hc-card-content">
                        <div class="hc-card-title">Đầu tư</div>
                        <div class="hc-card-value">${this.formatCurrency(this.userData.savings.investment)}</div>
                    </div>
                </div>

                <div class="hc-overview-card">
                    <div class="hc-card-icon">💳</div>
                    <div class="hc-card-content">
                        <div class="hc-card-title">Tổng nợ</div>
                        <div class="hc-card-value">${this.formatCurrency(this.userData.debts.total)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create analysis tab content
    createAnalysisTab() {
        const debtToIncomeRatio = this.userData.debts.total / (this.userData.income.monthly * 12);
        const emergencyMonths = this.userData.savings.emergency / this.userData.expenses.monthly;
        const savingsRate = (this.userData.income.monthly - this.userData.expenses.monthly) / this.userData.income.monthly;

        return `
            <div class="hc-analysis-section">
                <h4>📊 Phân tích chi tiết</h4>
                
                <div class="hc-metric-card">
                    <div class="hc-metric-header">
                        <span class="hc-metric-title">Tỷ lệ Nợ/Thu nhập</span>
                        <span class="hc-metric-status ${debtToIncomeRatio <= 0.36 ? 'good' : debtToIncomeRatio <= 0.5 ? 'warning' : 'danger'}">
                            ${debtToIncomeRatio <= 0.36 ? '✅ Tốt' : debtToIncomeRatio <= 0.5 ? '⚠️ Cảnh báo' : '🚨 Nguy hiểm'}
                        </span>
                    </div>
                    <div class="hc-metric-value">${(debtToIncomeRatio * 100).toFixed(1)}%</div>
                    <div class="hc-metric-bar">
                        <div class="hc-metric-fill" style="width: ${Math.min(debtToIncomeRatio * 100, 100)}%; background: ${debtToIncomeRatio <= 0.36 ? '#4CAF50' : debtToIncomeRatio <= 0.5 ? '#FFC107' : '#F44336'}"></div>
                    </div>
                    <div class="hc-metric-advice">
                        ${debtToIncomeRatio <= 0.36 ? 'Tỷ lệ nợ của bạn ở mức an toàn.' : 'Hãy xem xét giảm nợ để cải thiện tình hình tài chính.'}
                    </div>
                </div>

                <div class="hc-metric-card">
                    <div class="hc-metric-header">
                        <span class="hc-metric-title">Quỹ khẩn cấp</span>
                        <span class="hc-metric-status ${emergencyMonths >= 6 ? 'good' : emergencyMonths >= 3 ? 'warning' : 'danger'}">
                            ${emergencyMonths >= 6 ? '✅ Tốt' : emergencyMonths >= 3 ? '⚠️ Tạm đủ' : '🚨 Thiếu'}
                        </span>
                    </div>
                    <div class="hc-metric-value">${emergencyMonths.toFixed(1)} tháng</div>
                    <div class="hc-metric-bar">
                        <div class="hc-metric-fill" style="width: ${Math.min((emergencyMonths / 6) * 100, 100)}%; background: ${emergencyMonths >= 6 ? '#4CAF50' : emergencyMonths >= 3 ? '#FFC107' : '#F44336'}"></div>
                    </div>
                    <div class="hc-metric-advice">
                        ${emergencyMonths >= 6 ? 'Quỹ khẩn cấp của bạn đã đủ.' : `Hãy tiết kiệm thêm ${this.formatCurrency((6 - emergencyMonths) * this.userData.expenses.monthly)} để đạt mục tiêu 6 tháng.`}
                    </div>
                </div>

                <div class="hc-metric-card">
                    <div class="hc-metric-header">
                        <span class="hc-metric-title">Tỷ lệ tiết kiệm</span>
                        <span class="hc-metric-status ${savingsRate >= 0.2 ? 'good' : savingsRate >= 0.1 ? 'warning' : 'danger'}">
                            ${savingsRate >= 0.2 ? '✅ Xuất sắc' : savingsRate >= 0.1 ? '⚠️ Tạm được' : '🚨 Cần cải thiện'}
                        </span>
                    </div>
                    <div class="hc-metric-value">${(savingsRate * 100).toFixed(1)}%</div>
                    <div class="hc-metric-bar">
                        <div class="hc-metric-fill" style="width: ${Math.min(savingsRate * 100, 100)}%; background: ${savingsRate >= 0.2 ? '#4CAF50' : savingsRate >= 0.1 ? '#FFC107' : '#F44336'}"></div>
                    </div>
                    <div class="hc-metric-advice">
                        ${savingsRate >= 0.2 ? 'Tỷ lệ tiết kiệm của bạn rất tốt!' : 'Hãy cố gắng tiết kiệm ít nhất 10% thu nhập hàng tháng.'}
                    </div>
                </div>
            </div>

            <div class="hc-expenses-breakdown">
                <h4>💸 Phân tích chi tiêu</h4>
                <div class="hc-expense-chart">
                    ${this.createExpenseChart()}
                </div>
            </div>
        `;
    }

    // Create recommendations tab content
    createRecommendationsTab() {
        if (this.recommendations.length === 0) {
            return `
                <div class="hc-no-recommendations">
                    <div class="hc-success-icon">🎉</div>
                    <h4>Tuyệt vời!</h4>
                    <p>Tình hình tài chính của bạn đang rất tốt. Không có khuyến nghị cấp thiết nào.</p>
                </div>
            `;
        }

        return `
            <div class="hc-recommendations-list">
                <h4>💡 Khuyến nghị cải thiện</h4>
                ${this.recommendations.map(rec => `
                    <div class="hc-recommendation-card ${rec.priority}">
                        <div class="hc-rec-icon">${rec.icon}</div>
                        <div class="hc-rec-content">
                            <div class="hc-rec-header">
                                <h5>${rec.title}</h5>
                                <span class="hc-rec-priority">${rec.priority === 'high' ? 'Ưu tiên cao' : rec.priority === 'medium' ? 'Ưu tiên trung bình' : 'Gợi ý'}</span>
                            </div>
                            <p>${rec.description}</p>
                            <button class="hc-rec-action" onclick="window.financialDashboard.executeRecommendation('${rec.action}')">
                                Thực hiện ngay
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Create goals tab content
    createGoalsTab() {
        return `
            <div class="hc-goals-section">
                <h4>🎯 Mục tiêu tài chính</h4>
                
                <div class="hc-goals-grid">
                    <div class="hc-goal-category">
                        <h5>Mục tiêu ngắn hạn (< 1 năm)</h5>
                        <div class="hc-goals-list" id="short-term-goals">
                            ${this.userData.goals.shortTerm.map(goal => this.createGoalItem(goal)).join('')}
                        </div>
                        <button class="hc-add-goal-btn" onclick="window.financialDashboard.addGoal('shortTerm')">
                            + Thêm mục tiêu ngắn hạn
                        </button>
                    </div>

                    <div class="hc-goal-category">
                        <h5>Mục tiêu dài hạn (> 1 năm)</h5>
                        <div class="hc-goals-list" id="long-term-goals">
                            ${this.userData.goals.longTerm.map(goal => this.createGoalItem(goal)).join('')}
                        </div>
                        <button class="hc-add-goal-btn" onclick="window.financialDashboard.addGoal('longTerm')">
                            + Thêm mục tiêu dài hạn
                        </button>
                    </div>
                </div>

                <div class="hc-goal-suggestions">
                    <h5>💭 Gợi ý mục tiêu phổ biến</h5>
                    <div class="hc-suggestion-buttons">
                        <button onclick="window.financialDashboard.addSuggestedGoal('emergency', 'shortTerm')">🛡️ Quỹ khẩn cấp</button>
                        <button onclick="window.financialDashboard.addSuggestedGoal('house', 'longTerm')">🏠 Mua nhà</button>
                        <button onclick="window.financialDashboard.addSuggestedGoal('car', 'shortTerm')">🚗 Mua xe</button>
                        <button onclick="window.financialDashboard.addSuggestedGoal('vacation', 'shortTerm')">✈️ Du lịch</button>
                        <button onclick="window.financialDashboard.addSuggestedGoal('retirement', 'longTerm')">👴 Hưu trí</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Create goal item
    createGoalItem(goal) {
        const progress = Math.min((goal.saved / goal.target) * 100, 100);
        return `
            <div class="hc-goal-item">
                <div class="hc-goal-header">
                    <span class="hc-goal-name">${goal.name}</span>
                    <span class="hc-goal-amount">${this.formatCurrency(goal.saved)} / ${this.formatCurrency(goal.target)}</span>
                </div>
                <div class="hc-goal-progress">
                    <div class="hc-goal-bar">
                        <div class="hc-goal-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="hc-goal-percent">${progress.toFixed(1)}%</span>
                </div>
                <div class="hc-goal-deadline">Mục tiêu: ${new Date(goal.deadline).toLocaleDateString('vi-VN')}</div>
            </div>
        `;
    }

    // Create expense chart
    createExpenseChart() {
        const categories = this.userData.expenses.categories;
        const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
        
        const colors = {
            housing: '#FF6B35',
            food: '#F7931E', 
            transportation: '#4CAF50',
            utilities: '#2196F3',
            entertainment: '#9C27B0',
            debt: '#F44336',
            savings: '#4CAF50',
            other: '#795548'
        };

        const labels = {
            housing: 'Nhà ở',
            food: 'Ăn uống',
            transportation: 'Di chuyển',
            utilities: 'Tiện ích',
            entertainment: 'Giải trí',
            debt: 'Trả nợ',
            savings: 'Tiết kiệm',
            other: 'Khác'
        };

        return Object.entries(categories)
            .filter(([, amount]) => amount > 0)
            .map(([category, amount]) => {
                const percentage = (amount / total) * 100;
                return `
                    <div class="hc-expense-item">
                        <div class="hc-expense-label">
                            <span class="hc-expense-color" style="background: ${colors[category]}"></span>
                            <span class="hc-expense-name">${labels[category]}</span>
                        </div>
                        <div class="hc-expense-amount">${this.formatCurrency(amount)}</div>
                        <div class="hc-expense-percent">${percentage.toFixed(1)}%</div>
                    </div>
                `;
            }).join('');
    }

    // Helper methods
    getScoreColor(score) {
        if (score >= 80) return '#4CAF50';
        if (score >= 60) return '#FFC107';
        if (score >= 40) return '#FF9800';
        return '#F44336';
    }

    getScoreEmoji(score) {
        if (score >= 80) return '🌟';
        if (score >= 60) return '😊';
        if (score >= 40) return '😐';
        return '😟';
    }

    getScoreDescription(score) {
        if (score >= 80) return 'Xuất sắc!';
        if (score >= 60) return 'Tốt';
        if (score >= 40) return 'Trung bình';
        return 'Cần cải thiện';
    }

    getScoreAdvice(score) {
        if (score >= 80) return 'Tình hình tài chính của bạn rất tốt. Hãy duy trì và tiếp tục phát triển.';
        if (score >= 60) return 'Bạn đang trên đường đúng. Hãy thực hiện một vài cải thiện nhỏ.';
        if (score >= 40) return 'Có một số vấn đề cần chú ý. Hãy tập trung vào các khuyến nghị ưu tiên cao.';
        return 'Tình hình tài chính cần được cải thiện ngay. Hãy bắt đầu với các bước cơ bản.';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Execute recommendation action
    executeRecommendation(action) {
        const actions = {
            debt_consolidation: () => {
                chrome.tabs.create({ url: 'https://www.homecredit.vn/vay-tien-mat' });
                this.trackEvent('recommendation_executed', { action: 'debt_consolidation' });
            },
            emergency_fund: () => {
                this.showSavingsCalculator('emergency');
            },
            savings_plan: () => {
                this.showSavingsCalculator('general');
            },
            investment_start: () => {
                chrome.tabs.create({ url: 'https://www.homecredit.vn/dau-tu' });
                this.trackEvent('recommendation_executed', { action: 'investment_start' });
            },
            credit_card_apply: () => {
                chrome.tabs.create({ url: 'https://www.homecredit.vn/the-tin-dung' });
                this.trackEvent('recommendation_executed', { action: 'credit_card_apply' });
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    // Show data update form
    showDataForm() {
        // Implementation for data update form
        alert('Tính năng cập nhật dữ liệu sẽ được triển khai trong phiên bản tiếp theo.');
    }

    // Add goal
    addGoal(type) {
        const name = prompt('Tên mục tiêu:');
        const target = parseFloat(prompt('Số tiền mục tiêu (VND):'));
        const deadline = prompt('Thời hạn (YYYY-MM-DD):');

        if (name && target && deadline) {
            const goal = {
                id: Date.now(),
                name: name,
                target: target,
                saved: 0,
                deadline: deadline,
                created: new Date().toISOString()
            };

            this.userData.goals[type].push(goal);
            this.saveUserData();
            this.refreshDashboard();
        }
    }

    // Add suggested goal
    addSuggestedGoal(suggestionType, goalType) {
        const suggestions = {
            emergency: { name: 'Quỹ khẩn cấp', target: this.userData.expenses.monthly * 6 },
            house: { name: 'Mua nhà', target: 2000000000 },
            car: { name: 'Mua xe', target: 500000000 },
            vacation: { name: 'Du lịch', target: 50000000 },
            retirement: { name: 'Hưu trí', target: 5000000000 }
        };

        const suggestion = suggestions[suggestionType];
        if (suggestion) {
            const deadline = goalType === 'shortTerm' ? 
                new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const goal = {
                id: Date.now(),
                name: suggestion.name,
                target: suggestion.target,
                saved: 0,
                deadline: deadline,
                created: new Date().toISOString()
            };

            this.userData.goals[goalType].push(goal);
            this.saveUserData();
            this.refreshDashboard();
        }
    }

    // Save user data
    async saveUserData() {
        if (chrome && chrome.storage) {
            await chrome.storage.local.set({ financialData: this.userData });
        }
    }

    // Refresh dashboard
    refreshDashboard() {
        this.calculateHealthScore();
        document.querySelector('.hc-dashboard-modal').remove();
        this.show();
    }

    // Track events
    trackEvent(eventName, data) {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'trackEvent',
                eventName: eventName,
                data: data
            }).catch(() => {});
        }
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('hc-tab-btn')) {
                const tabName = e.target.dataset.tab;
                
                document.querySelectorAll('.hc-tab-btn').forEach(btn => 
                    btn.classList.remove('active'));
                document.querySelectorAll('.hc-tab-content').forEach(content => 
                    content.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            }
        });
    }

    // Show dashboard
    show() {
        const existing = document.querySelector('.hc-dashboard-modal');
        if (existing) existing.remove();

        const modal = this.createDashboardModal();
        document.body.appendChild(modal);
        this.setupEventListeners();

        this.trackEvent('financial_dashboard_opened', { 
            healthScore: this.healthScore,
            recommendationsCount: this.recommendations.length 
        });
    }
}

// Initialize dashboard
window.financialDashboard = new FinancialHealthDashboard();
