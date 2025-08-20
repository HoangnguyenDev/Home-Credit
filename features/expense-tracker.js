// Expense Tracker Feature
// Theo dõi và phân tích chi tiêu cá nhân

class ExpenseTracker {
    constructor() {
        this.modal = null;
        this.expenses = [];
        this.categories = [
            { id: 'food', name: 'Ăn uống', icon: '🍽️', color: '#FF6B35' },
            { id: 'transport', name: 'Di chuyển', icon: '🚗', color: '#2196F3' },
            { id: 'shopping', name: 'Mua sắm', icon: '🛍️', color: '#E91E63' },
            { id: 'entertainment', name: 'Giải trí', icon: '🎬', color: '#9C27B0' },
            { id: 'health', name: 'Sức khỏe', icon: '🏥', color: '#4CAF50' },
            { id: 'education', name: 'Giáo dục', icon: '📚', color: '#FF9800' },
            { id: 'utilities', name: 'Tiện ích', icon: '💡', color: '#607D8B' },
            { id: 'other', name: 'Khác', icon: '📝', color: '#795548' }
        ];
        this.budgets = {};
        this.loadData();
    }

    // Show expense tracker
    show() {
        this.createModal();
        document.body.appendChild(this.modal);
        this.updateOverview();
        this.renderExpensesList();
        this.renderCategoryChart();
    }

    // Create expense tracker modal
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'hc-expense-tracker-modal hc-extension-reset';
        modal.innerHTML = `
            <div class="hc-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="hc-modal-content">
                <div class="hc-modal-header">
                    <h3>💰 Theo Dõi Chi Tiêu</h3>
                    <button class="hc-close-btn" onclick="this.closest('.hc-expense-tracker-modal').remove()">×</button>
                </div>

                <div class="hc-expense-tabs">
                    <button class="hc-tab-btn active" data-tab="overview">Tổng quan</button>
                    <button class="hc-tab-btn" data-tab="add">Thêm chi tiêu</button>
                    <button class="hc-tab-btn" data-tab="budget">Ngân sách</button>
                    <button class="hc-tab-btn" data-tab="reports">Báo cáo</button>
                </div>

                <!-- Overview Tab -->
                <div class="hc-tab-content active" id="overview-tab">
                    <div class="hc-overview-cards">
                        <div class="hc-overview-card">
                            <div class="hc-card-icon">💳</div>
                            <div class="hc-card-info">
                                <div class="hc-card-title">Chi tiêu tháng này</div>
                                <div class="hc-card-value" id="monthly-spending">0 VND</div>
                            </div>
                        </div>
                        <div class="hc-overview-card">
                            <div class="hc-card-icon">🎯</div>
                            <div class="hc-card-info">
                                <div class="hc-card-title">Ngân sách còn lại</div>
                                <div class="hc-card-value" id="budget-remaining">0 VND</div>
                            </div>
                        </div>
                        <div class="hc-overview-card">
                            <div class="hc-card-icon">📊</div>
                            <div class="hc-card-info">
                                <div class="hc-card-title">Trung bình/ngày</div>
                                <div class="hc-card-value" id="daily-average">0 VND</div>
                            </div>
                        </div>
                    </div>

                    <div class="hc-category-breakdown">
                        <h4>📈 Phân tích theo danh mục</h4>
                        <div class="hc-chart-container">
                            <canvas id="category-chart" width="300" height="200"></canvas>
                        </div>
                    </div>

                    <div class="hc-recent-expenses">
                        <h4>🕒 Chi tiêu gần đây</h4>
                        <div id="expenses-list">
                            <!-- Expenses will be populated here -->
                        </div>
                        <button class="hc-btn-secondary" onclick="window.expenseTracker.showAllExpenses()">
                            Xem tất cả chi tiêu
                        </button>
                    </div>
                </div>

                <!-- Add Expense Tab -->
                <div class="hc-tab-content" id="add-tab">
                    <form class="hc-expense-form" id="expense-form">
                        <div class="hc-form-row">
                            <div class="hc-form-group">
                                <label>Số tiền (VND)</label>
                                <input type="number" id="expense-amount" placeholder="50,000" required>
                            </div>
                            <div class="hc-form-group">
                                <label>Ngày</label>
                                <input type="date" id="expense-date" required>
                            </div>
                        </div>

                        <div class="hc-form-group">
                            <label>Danh mục</label>
                            <div class="hc-category-selector" id="category-selector">
                                ${this.categories.map(cat => `
                                    <div class="hc-category-item" data-category="${cat.id}">
                                        <span class="hc-category-icon">${cat.icon}</span>
                                        <span class="hc-category-name">${cat.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <input type="hidden" id="selected-category" required>
                        </div>

                        <div class="hc-form-group">
                            <label>Mô tả (không bắt buộc)</label>
                            <input type="text" id="expense-description" placeholder="Ăn trưa, xăng xe, mua sách...">
                        </div>

                        <div class="hc-form-group">
                            <label>Phương thức thanh toán</label>
                            <select id="payment-method">
                                <option value="cash">Tiền mặt</option>
                                <option value="card">Thẻ tín dụng</option>
                                <option value="bank">Chuyển khoản</option>
                                <option value="ewallet">Ví điện tử</option>
                            </select>
                        </div>

                        <div class="hc-form-actions">
                            <button type="submit" class="hc-btn-primary">💾 Lưu chi tiêu</button>
                            <button type="button" class="hc-btn-secondary" onclick="window.expenseTracker.resetForm()">
                                🔄 Nhập lại
                            </button>
                        </div>
                    </form>

                    <div class="hc-quick-add">
                        <h4>⚡ Thêm nhanh</h4>
                        <div class="hc-quick-buttons">
                            <button onclick="window.expenseTracker.quickAdd('food', 50000, 'Ăn trưa')">🍽️ Ăn trưa 50k</button>
                            <button onclick="window.expenseTracker.quickAdd('transport', 20000, 'Xăng xe')">⛽ Xăng xe 20k</button>
                            <button onclick="window.expenseTracker.quickAdd('food', 15000, 'Cà phê')">☕ Cà phê 15k</button>
                            <button onclick="window.expenseTracker.quickAdd('transport', 25000, 'Grab')">🚗 Grab 25k</button>
                        </div>
                    </div>
                </div>

                <!-- Budget Tab -->
                <div class="hc-tab-content" id="budget-tab">
                    <div class="hc-budget-overview">
                        <h4>💰 Ngân sách tháng này</h4>
                        <div class="hc-budget-cards">
                            ${this.categories.map(cat => `
                                <div class="hc-budget-card" data-category="${cat.id}">
                                    <div class="hc-budget-header">
                                        <span class="hc-budget-icon">${cat.icon}</span>
                                        <span class="hc-budget-name">${cat.name}</span>
                                    </div>
                                    <div class="hc-budget-amount">
                                        <input type="number" placeholder="0" data-budget="${cat.id}" onchange="window.expenseTracker.updateBudget('${cat.id}', this.value)">
                                        <span>VND</span>
                                    </div>
                                    <div class="hc-budget-progress">
                                        <div class="hc-progress-bar">
                                            <div class="hc-progress-fill" id="progress-${cat.id}"></div>
                                        </div>
                                        <div class="hc-progress-text">
                                            <span id="spent-${cat.id}">0</span> / <span id="budget-${cat.id}">0</span> VND
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="hc-budget-tips">
                        <h4>💡 Mẹo quản lý ngân sách</h4>
                        <div class="hc-tip-item">
                            <span class="hc-tip-icon">🎯</span>
                            <span>Áp dụng quy tắc 50/30/20: 50% thiết yếu, 30% giải trí, 20% tiết kiệm</span>
                        </div>
                        <div class="hc-tip-item">
                            <span class="hc-tip-icon">📱</span>
                            <span>Ghi chép chi tiêu ngay sau khi mua để không quên</span>
                        </div>
                        <div class="hc-tip-item">
                            <span class="hc-tip-icon">🔍</span>
                            <span>Xem lại chi tiêu hàng tuần để điều chỉnh kịp thời</span>
                        </div>
                    </div>
                </div>

                <!-- Reports Tab -->
                <div class="hc-tab-content" id="reports-tab">
                    <div class="hc-reports-header">
                        <h4>📊 Báo cáo chi tiêu</h4>
                        <div class="hc-period-selector">
                            <select id="report-period" onchange="window.expenseTracker.updateReports()">
                                <option value="week">7 ngày qua</option>
                                <option value="month" selected>Tháng này</option>
                                <option value="quarter">Quý này</option>
                                <option value="year">Năm này</option>
                            </select>
                        </div>
                    </div>

                    <div class="hc-spending-trend">
                        <h5>📈 Xu hướng chi tiêu</h5>
                        <canvas id="trend-chart" width="400" height="200"></canvas>
                    </div>

                    <div class="hc-insights">
                        <h5>🔍 Phân tích thông minh</h5>
                        <div id="spending-insights">
                            <!-- Insights will be populated here -->
                        </div>
                    </div>

                    <div class="hc-export-options">
                        <h5>📥 Xuất dữ liệu</h5>
                        <div class="hc-export-buttons">
                            <button class="hc-btn-secondary" onclick="window.expenseTracker.exportToCSV()">
                                📊 Xuất Excel (CSV)
                            </button>
                            <button class="hc-btn-secondary" onclick="window.expenseTracker.exportToPDF()">
                                📄 Xuất PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div class="hc-modal-footer">
                    <div class="hc-home-credit-promo">
                        <div class="hc-promo-content">
                            <strong>💳 Thẻ tín dụng Home Credit</strong>
                            <p>Theo dõi chi tiêu tự động, hoàn tiền 10% mọi giao dịch!</p>
                        </div>
                        <button class="hc-promo-btn" onclick="window.expenseTracker.openCreditCard()">
                            Tìm hiểu thêm
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.modal = modal;
        this.setupTabSwitching();
        this.setupFormHandlers();
        this.setupCategorySelector();
        this.setDefaultDate();
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

                // Refresh data when switching to certain tabs
                if (targetTab === 'overview') {
                    this.updateOverview();
                } else if (targetTab === 'reports') {
                    this.updateReports();
                }
            });
        });
    }

    // Setup form handlers
    setupFormHandlers() {
        const form = this.modal.querySelector('#expense-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });
    }

    // Setup category selector
    setupCategorySelector() {
        const selector = this.modal.querySelector('#category-selector');
        const items = selector.querySelectorAll('.hc-category-item');
        
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                document.getElementById('selected-category').value = item.dataset.category;
            });
        });
    }

    // Set default date to today
    setDefaultDate() {
        const dateInput = this.modal.querySelector('#expense-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Load data from storage
    loadData() {
        if (chrome && chrome.storage) {
            chrome.storage.local.get(['expenses', 'budgets'], (result) => {
                this.expenses = result.expenses || [];
                this.budgets = result.budgets || {};
            });
        } else {
            // Fallback to localStorage
            const expenses = localStorage.getItem('hc_expenses');
            const budgets = localStorage.getItem('hc_budgets');
            this.expenses = expenses ? JSON.parse(expenses) : [];
            this.budgets = budgets ? JSON.parse(budgets) : {};
        }
    }

    // Save data to storage
    saveData() {
        const data = {
            expenses: this.expenses,
            budgets: this.budgets
        };

        if (chrome && chrome.storage) {
            chrome.storage.local.set(data);
        } else {
            localStorage.setItem('hc_expenses', JSON.stringify(this.expenses));
            localStorage.setItem('hc_budgets', JSON.stringify(this.budgets));
        }
    }

    // Add new expense
    addExpense() {
        const amount = parseInt(document.getElementById('expense-amount').value);
        const date = document.getElementById('expense-date').value;
        const category = document.getElementById('selected-category').value;
        const description = document.getElementById('expense-description').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (!amount || !date || !category) {
            this.showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        const expense = {
            id: Date.now(),
            amount: amount,
            date: date,
            category: category,
            description: description,
            paymentMethod: paymentMethod,
            timestamp: new Date().toISOString()
        };

        this.expenses.unshift(expense);
        this.saveData();
        this.resetForm();
        this.updateOverview();
        this.showNotification('✅ Đã thêm chi tiêu thành công!');

        // Track event
        this.trackEvent('expense_added', {
            category: category,
            amount: amount,
            paymentMethod: paymentMethod
        });
    }

    // Quick add expense
    quickAdd(category, amount, description) {
        const expense = {
            id: Date.now(),
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            category: category,
            description: description,
            paymentMethod: 'cash',
            timestamp: new Date().toISOString()
        };

        this.expenses.unshift(expense);
        this.saveData();
        this.updateOverview();
        this.showNotification(`✅ Đã thêm ${description} - ${amount.toLocaleString('vi-VN')} VND`);

        this.trackEvent('expense_quick_added', {
            category: category,
            amount: amount
        });
    }

    // Reset form
    resetForm() {
        document.getElementById('expense-form').reset();
        document.getElementById('selected-category').value = '';
        document.querySelectorAll('.hc-category-item').forEach(item => {
            item.classList.remove('selected');
        });
        this.setDefaultDate();
    }

    // Update overview tab
    updateOverview() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
        });

        const totalSpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalBudget = Object.values(this.budgets).reduce((sum, budget) => sum + (budget || 0), 0);
        const budgetRemaining = totalBudget - totalSpending;
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const currentDay = new Date().getDate();
        const dailyAverage = currentDay > 0 ? totalSpending / currentDay : 0;

        // Update overview cards
        const monthlySpendingEl = document.getElementById('monthly-spending');
        const budgetRemainingEl = document.getElementById('budget-remaining');
        const dailyAverageEl = document.getElementById('daily-average');

        if (monthlySpendingEl) {
            monthlySpendingEl.textContent = totalSpending.toLocaleString('vi-VN') + ' VND';
        }
        
        if (budgetRemainingEl) {
            budgetRemainingEl.textContent = budgetRemaining.toLocaleString('vi-VN') + ' VND';
            budgetRemainingEl.style.color = budgetRemaining >= 0 ? '#4CAF50' : '#F44336';
        }
        
        if (dailyAverageEl) {
            dailyAverageEl.textContent = Math.round(dailyAverage).toLocaleString('vi-VN') + ' VND';
        }

        this.renderExpensesList();
        this.renderCategoryChart();
    }

    // Render expenses list
    renderExpensesList() {
        const container = document.getElementById('expenses-list');
        if (!container) return;

        const recentExpenses = this.expenses.slice(0, 5);
        
        if (recentExpenses.length === 0) {
            container.innerHTML = `
                <div class="hc-empty-state">
                    <div class="hc-empty-icon">💸</div>
                    <p>Chưa có chi tiêu nào. Hãy thêm chi tiêu đầu tiên!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentExpenses.map(expense => {
            const category = this.categories.find(cat => cat.id === expense.category);
            const date = new Date(expense.date).toLocaleDateString('vi-VN');
            
            return `
                <div class="hc-expense-item">
                    <div class="hc-expense-icon" style="background: ${category?.color || '#999'}">${category?.icon || '📝'}</div>
                    <div class="hc-expense-details">
                        <div class="hc-expense-desc">${expense.description || category?.name || 'Chi tiêu'}</div>
                        <div class="hc-expense-meta">${date} • ${category?.name || 'Khác'}</div>
                    </div>
                    <div class="hc-expense-amount">-${expense.amount.toLocaleString('vi-VN')} VND</div>
                </div>
            `;
        }).join('');
    }

    // Render category chart
    renderCategoryChart() {
        const canvas = document.getElementById('category-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Get current month expenses
        const monthlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
        });

        // Group by category
        const categoryTotals = {};
        monthlyExpenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        // Draw pie chart
        this.drawPieChart(ctx, categoryTotals, canvas.width, canvas.height);
    }

    // Draw pie chart
    drawPieChart(ctx, data, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        const total = Object.values(data).reduce((sum, value) => sum + value, 0);
        
        if (total === 0) {
            ctx.fillStyle = '#f0f0f0';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Chưa có dữ liệu', centerX, centerY);
            return;
        }

        let currentAngle = -Math.PI / 2;

        Object.entries(data).forEach(([categoryId, amount]) => {
            const category = this.categories.find(cat => cat.id === categoryId);
            const sliceAngle = (amount / total) * 2 * Math.PI;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = category?.color || '#999';
            ctx.fill();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            const percentage = ((amount / total) * 100).toFixed(1);
            ctx.fillText(`${category?.icon || '📝'} ${percentage}%`, labelX, labelY);

            currentAngle += sliceAngle;
        });
    }

    // Update budget
    updateBudget(categoryId, amount) {
        this.budgets[categoryId] = parseInt(amount) || 0;
        this.saveData();
        this.updateBudgetProgress();
    }

    // Update budget progress
    updateBudgetProgress() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        this.categories.forEach(category => {
            const categoryExpenses = this.expenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expense.category === category.id && 
                       expenseDate.getMonth() === currentMonth && 
                       expenseDate.getFullYear() === currentYear;
            });

            const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const budget = this.budgets[category.id] || 0;
            const progress = budget > 0 ? (spent / budget) * 100 : 0;

            const progressBar = document.getElementById(`progress-${category.id}`);
            const spentEl = document.getElementById(`spent-${category.id}`);
            const budgetEl = document.getElementById(`budget-${category.id}`);

            if (progressBar) {
                progressBar.style.width = Math.min(progress, 100) + '%';
                progressBar.style.backgroundColor = progress > 100 ? '#F44336' : '#4CAF50';
            }

            if (spentEl) spentEl.textContent = spent.toLocaleString('vi-VN');
            if (budgetEl) budgetEl.textContent = budget.toLocaleString('vi-VN');
        });
    }

    // Show all expenses
    showAllExpenses() {
        // Switch to a dedicated view or expand the list
        this.showNotification('Tính năng xem tất cả chi tiêu đang được phát triển!');
    }

    // Update reports
    updateReports() {
        this.generateInsights();
        this.drawTrendChart();
    }

    // Generate spending insights
    generateInsights() {
        const container = document.getElementById('spending-insights');
        if (!container) return;

        const insights = [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Get current month expenses
        const monthlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
        });

        const totalSpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalBudget = Object.values(this.budgets).reduce((sum, budget) => sum + (budget || 0), 0);

        // Budget analysis
        if (totalBudget > 0) {
            const budgetUsage = (totalSpending / totalBudget) * 100;
            if (budgetUsage > 90) {
                insights.push({
                    type: 'warning',
                    title: '⚠️ Ngân sách sắp cạn kiệt',
                    message: `Bạn đã sử dụng ${budgetUsage.toFixed(1)}% ngân sách tháng này.`
                });
            } else if (budgetUsage < 50) {
                insights.push({
                    type: 'success',
                    title: '✅ Tiết kiệm tốt',
                    message: `Bạn mới sử dụng ${budgetUsage.toFixed(1)}% ngân sách. Tuyệt vời!`
                });
            }
        }

        // Category analysis
        const categoryTotals = {};
        monthlyExpenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
        if (topCategory) {
            const category = this.categories.find(cat => cat.id === topCategory[0]);
            const percentage = ((topCategory[1] / totalSpending) * 100).toFixed(1);
            insights.push({
                type: 'info',
                title: '📊 Danh mục chi tiêu nhiều nhất',
                message: `${category?.name || 'Khác'} chiếm ${percentage}% tổng chi tiêu (${topCategory[1].toLocaleString('vi-VN')} VND).`
            });
        }

        // Render insights
        container.innerHTML = insights.map(insight => `
            <div class="hc-insight-item ${insight.type}">
                <div class="hc-insight-title">${insight.title}</div>
                <div class="hc-insight-message">${insight.message}</div>
            </div>
        `).join('');

        if (insights.length === 0) {
            container.innerHTML = `
                <div class="hc-insight-item info">
                    <div class="hc-insight-title">💡 Cần thêm dữ liệu</div>
                    <div class="hc-insight-message">Hãy thêm chi tiêu và ngân sách để nhận phân tích thông minh.</div>
                </div>
            `;
        }
    }

    // Draw trend chart
    drawTrendChart() {
        const canvas = document.getElementById('trend-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        // Implementation for trend chart would go here
        // For now, show a placeholder
        ctx.fillStyle = '#f0f0f0';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Biểu đồ xu hướng sẽ được cập nhật sau', canvas.width / 2, canvas.height / 2);
    }

    // Export to CSV
    exportToCSV() {
        const headers = ['Ngày', 'Danh mục', 'Mô tả', 'Số tiền', 'Phương thức'];
        const rows = this.expenses.map(expense => {
            const category = this.categories.find(cat => cat.id === expense.category);
            return [
                expense.date,
                category?.name || 'Khác',
                expense.description || '',
                expense.amount,
                expense.paymentMethod
            ];
        });

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chi-tieu-${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('✅ Đã xuất file CSV thành công!');
        this.trackEvent('expense_export_csv');
    }

    // Export to PDF
    exportToPDF() {
        this.showNotification('Tính năng xuất PDF đang được phát triển!');
        this.trackEvent('expense_export_pdf_requested');
    }

    // Open Home Credit credit card page
    openCreditCard() {
        if (chrome && chrome.tabs) {
            chrome.tabs.create({ url: 'https://www.homecredit.vn/the-tin-dung' });
        } else {
            window.open('https://www.homecredit.vn/the-tin-dung', '_blank');
        }
        this.trackEvent('credit_card_clicked', { source: 'expense_tracker' });
    }

    // Track events
    trackEvent(eventName, data = {}) {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'trackEvent',
                eventName: eventName,
                data: { source: 'expense_tracker', ...data }
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
            z-index: 10001;
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
    window.expenseTracker = new ExpenseTracker();
}
