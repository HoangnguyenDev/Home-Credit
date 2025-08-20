// Credit Score Checker Feature
// Giúp người dùng kiểm tra và cải thiện điểm tín dụng

class CreditScoreChecker {
    constructor() {
        this.modal = null;
        this.currentScore = null;
        this.factors = {
            paymentHistory: 35,
            creditUtilization: 30,
            creditHistory: 15,
            creditMix: 10,
            newCredit: 10
        };
    }

    // Show credit score checker
    show() {
        this.createModal();
        document.body.appendChild(this.modal);
        this.loadUserData();
    }

    // Create credit score modal
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'hc-credit-score-modal hc-extension-reset';
        modal.innerHTML = `
            <div class="hc-modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="hc-modal-content">
                <div class="hc-modal-header">
                    <h3>📊 Kiểm Tra Điểm Tín Dụng</h3>
                    <button class="hc-close-btn" onclick="this.closest('.hc-credit-score-modal').remove()">×</button>
                </div>

                <div class="hc-credit-tabs">
                    <button class="hc-tab-btn active" data-tab="check">Kiểm tra điểm</button>
                    <button class="hc-tab-btn" data-tab="improve">Cải thiện điểm</button>
                    <button class="hc-tab-btn" data-tab="history">Lịch sử tín dụng</button>
                </div>

                <div class="hc-tab-content active" id="check-tab">
                    <div class="hc-score-display">
                        <div class="hc-score-circle">
                            <div class="hc-score-value" id="credit-score">--</div>
                            <div class="hc-score-label">Điểm tín dụng</div>
                        </div>
                        <div class="hc-score-status" id="score-status">
                            Đang tải...
                        </div>
                    </div>

                    <div class="hc-score-factors">
                        <h4>Các yếu tố ảnh hưởng:</h4>
                        <div class="hc-factor" data-factor="payment">
                            <span class="hc-factor-name">Lịch sử thanh toán</span>
                            <div class="hc-factor-bar">
                                <div class="hc-factor-fill" style="width: 0%"></div>
                            </div>
                            <span class="hc-factor-weight">35%</span>
                        </div>
                        <div class="hc-factor" data-factor="utilization">
                            <span class="hc-factor-name">Tỷ lệ sử dụng tín dụng</span>
                            <div class="hc-factor-bar">
                                <div class="hc-factor-fill" style="width: 0%"></div>
                            </div>
                            <span class="hc-factor-weight">30%</span>
                        </div>
                        <div class="hc-factor" data-factor="history">
                            <span class="hc-factor-name">Thời gian sử dụng tín dụng</span>
                            <div class="hc-factor-bar">
                                <div class="hc-factor-fill" style="width: 0%"></div>
                            </div>
                            <span class="hc-factor-weight">15%</span>
                        </div>
                        <div class="hc-factor" data-factor="mix">
                            <span class="hc-factor-name">Đa dạng sản phẩm tín dụng</span>
                            <div class="hc-factor-bar">
                                <div class="hc-factor-fill" style="width: 0%"></div>
                            </div>
                            <span class="hc-factor-weight">10%</span>
                        </div>
                        <div class="hc-factor" data-factor="new">
                            <span class="hc-factor-name">Tín dụng mới</span>
                            <div class="hc-factor-bar">
                                <div class="hc-factor-fill" style="width: 0%"></div>
                            </div>
                            <span class="hc-factor-weight">10%</span>
                        </div>
                    </div>

                    <div class="hc-check-actions">
                        <button class="hc-btn-primary" onclick="window.creditScoreChecker.checkScore()">
                            🔄 Cập nhật điểm tín dụng
                        </button>
                        <button class="hc-btn-secondary" onclick="window.creditScoreChecker.downloadReport()">
                            📥 Tải báo cáo tín dụng
                        </button>
                    </div>
                </div>

                <div class="hc-tab-content" id="improve-tab">
                    <div class="hc-improvement-tips">
                        <h4>💡 Gợi ý cải thiện điểm tín dụng:</h4>
                        <div class="hc-tip-card">
                            <div class="hc-tip-icon">⏰</div>
                            <div class="hc-tip-content">
                                <h5>Thanh toán đúng hạn</h5>
                                <p>Luôn thanh toán khoản vay và thẻ tín dụng đúng thời hạn. Thiết lập nhắc nhở tự động.</p>
                                <div class="hc-tip-impact positive">Tác động: +15-25 điểm</div>
                            </div>
                        </div>
                        <div class="hc-tip-card">
                            <div class="hc-tip-icon">📊</div>
                            <div class="hc-tip-content">
                                <h5>Giữ tỷ lệ sử dụng tín dụng thấp</h5>
                                <p>Sử dụng không quá 30% hạn mức thẻ tín dụng. Lý tưởng là dưới 10%.</p>
                                <div class="hc-tip-impact positive">Tác động: +10-20 điểm</div>
                            </div>
                        </div>
                        <div class="hc-tip-card">
                            <div class="hc-tip-icon">🏦</div>
                            <div class="hc-tip-content">
                                <h5>Đa dạng hóa sản phẩm tín dụng</h5>
                                <p>Có cả thẻ tín dụng và khoản vay để tạo hồ sơ tín dụng đa dạng.</p>
                                <div class="hc-tip-impact neutral">Tác động: +5-10 điểm</div>
                            </div>
                        </div>
                    </div>

                    <div class="hc-action-plan">
                        <h4>📋 Kế hoạch hành động 90 ngày:</h4>
                        <div class="hc-action-item">
                            <input type="checkbox" id="action1">
                            <label for="action1">Thiết lập auto-pay cho tất cả thẻ tín dụng</label>
                        </div>
                        <div class="hc-action-item">
                            <input type="checkbox" id="action2">
                            <label for="action2">Giảm số dư thẻ tín dụng xuống dưới 30%</label>
                        </div>
                        <div class="hc-action-item">
                            <input type="checkbox" id="action3">
                            <label for="action3">Kiểm tra báo cáo tín dụng hàng tháng</label>
                        </div>
                        <div class="hc-action-item">
                            <input type="checkbox" id="action4">
                            <label for="action4">Không mở thêm tài khoản tín dụng mới</label>
                        </div>
                    </div>
                </div>

                <div class="hc-tab-content" id="history-tab">
                    <div class="hc-credit-history">
                        <h4>📈 Lịch sử điểm tín dụng (6 tháng gần nhất):</h4>
                        <div class="hc-history-chart" id="credit-chart">
                            <canvas id="score-chart" width="400" height="200"></canvas>
                        </div>
                        
                        <div class="hc-history-events">
                            <h5>Sự kiện quan trọng:</h5>
                            <div class="hc-event positive">
                                <span class="hc-event-date">01/12/2024</span>
                                <span class="hc-event-desc">Thanh toán đúng hạn thẻ tín dụng</span>
                                <span class="hc-event-impact">+5 điểm</span>
                            </div>
                            <div class="hc-event neutral">
                                <span class="hc-event-date">15/11/2024</span>
                                <span class="hc-event-desc">Mở tài khoản Home Credit</span>
                                <span class="hc-event-impact">0 điểm</span>
                            </div>
                            <div class="hc-event positive">
                                <span class="hc-event-date">03/11/2024</span>
                                <span class="hc-event-desc">Giảm tỷ lệ sử dụng tín dụng</span>
                                <span class="hc-event-impact">+12 điểm</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hc-modal-footer">
                    <small>
                        🔒 Thông tin được bảo mật theo tiêu chuẩn ngành. 
                        Điểm số chỉ mang tính chất tham khảo.
                    </small>
                </div>
            </div>
        `;

        this.modal = modal;
        this.setupTabSwitching();
    }

    // Setup tab switching
    setupTabSwitching() {
        const tabBtns = this.modal.querySelectorAll('.hc-tab-btn');
        const tabContents = this.modal.querySelectorAll('.hc-tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                document.getElementById(targetTab + '-tab').classList.add('active');
            });
        });
    }

    // Load user credit data
    loadUserData() {
        // Simulate loading user credit data
        setTimeout(() => {
            this.simulateCreditScore();
        }, 1000);
    }

    // Simulate credit score calculation
    simulateCreditScore() {
        // Generate a realistic credit score based on user behavior
        const baseScore = 650;
        const randomVariation = Math.floor(Math.random() * 100);
        this.currentScore = baseScore + randomVariation;

        this.updateScoreDisplay();
        this.updateFactors();
        this.drawScoreChart();
    }

    // Update score display
    updateScoreDisplay() {
        const scoreElement = document.getElementById('credit-score');
        const statusElement = document.getElementById('score-status');
        
        if (scoreElement) {
            scoreElement.textContent = this.currentScore;
            
            // Animate score counting up
            let current = 0;
            const increment = this.currentScore / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= this.currentScore) {
                    current = this.currentScore;
                    clearInterval(timer);
                }
                scoreElement.textContent = Math.round(current);
            }, 20);
        }

        if (statusElement) {
            let status = '';
            let statusClass = '';
            
            if (this.currentScore >= 750) {
                status = '🌟 Xuất sắc - Dễ dàng được duyệt vay với lãi suất tốt';
                statusClass = 'excellent';
            } else if (this.currentScore >= 700) {
                status = '✅ Tốt - Có thể được duyệt vay với điều kiện thuận lợi';
                statusClass = 'good';
            } else if (this.currentScore >= 650) {
                status = '⚠️ Trung bình - Cần cải thiện để có điều kiện vay tốt hơn';
                statusClass = 'average';
            } else {
                status = '❌ Cần cải thiện - Nên tập trung nâng cao điểm tín dụng';
                statusClass = 'poor';
            }
            
            statusElement.textContent = status;
            statusElement.className = `hc-score-status ${statusClass}`;
        }
    }

    // Update credit factors display
    updateFactors() {
        const factors = {
            payment: Math.min(100, (this.currentScore - 300) / 4),
            utilization: Math.min(100, (this.currentScore - 250) / 5),
            history: Math.min(100, (this.currentScore - 200) / 6),
            mix: Math.min(100, (this.currentScore - 400) / 3),
            new: Math.min(100, (this.currentScore - 350) / 4)
        };

        Object.keys(factors).forEach(factor => {
            const element = this.modal.querySelector(`[data-factor="${factor}"] .hc-factor-fill`);
            if (element) {
                setTimeout(() => {
                    element.style.width = `${factors[factor]}%`;
                }, 500);
            }
        });
    }

    // Draw credit score chart
    drawScoreChart() {
        const canvas = document.getElementById('score-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Generate historical data
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const scores = [
            this.currentScore - 45,
            this.currentScore - 30,
            this.currentScore - 35,
            this.currentScore - 15,
            this.currentScore - 8,
            this.currentScore
        ];

        // Draw grid
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(50, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
        }

        // Draw line chart
        ctx.strokeStyle = '#FF6B35';
        ctx.lineWidth = 3;
        ctx.beginPath();

        const stepX = (width - 70) / (scores.length - 1);
        scores.forEach((score, index) => {
            const x = 50 + index * stepX;
            const y = height - 20 - ((score - 500) / 300) * (height - 40);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#FF6B35';
        scores.forEach((score, index) => {
            const x = 50 + index * stepX;
            const y = height - 20 - ((score - 500) / 300) * (height - 40);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        months.forEach((month, index) => {
            const x = 50 + index * stepX;
            ctx.fillText(month, x, height - 5);
        });
    }

    // Check credit score
    checkScore() {
        this.trackEvent('credit_score_checked');
        
        // Show loading state
        document.getElementById('credit-score').textContent = '--';
        document.getElementById('score-status').textContent = 'Đang kiểm tra...';
        
        // Simulate API call
        setTimeout(() => {
            this.simulateCreditScore();
            this.showNotification('Điểm tín dụng đã được cập nhật!');
        }, 2000);
    }

    // Download credit report
    downloadReport() {
        this.trackEvent('credit_report_downloaded');
        
        // Generate simple credit report
        const reportData = {
            score: this.currentScore,
            date: new Date().toLocaleDateString('vi-VN'),
            factors: {
                payment: 'Tốt',
                utilization: 'Trung bình',
                history: 'Tốt',
                mix: 'Cần cải thiện',
                new: 'Tốt'
            }
        };

        // Create downloadable file
        const content = `
BÁOÁC TÍN DỤNG HOME CREDIT VIETNAM
=====================================

Ngày tạo: ${reportData.date}
Điểm tín dụng: ${reportData.score}

CHI TIẾT ĐÁNH GIÁ:
- Lịch sử thanh toán: ${reportData.factors.payment}
- Tỷ lệ sử dụng tín dụng: ${reportData.factors.utilization}
- Thời gian sử dụng tín dụng: ${reportData.factors.history}
- Đa dạng sản phẩm: ${reportData.factors.mix}
- Tín dụng mới: ${reportData.factors.new}

Ghi chú: Đây là báo cáo mô phỏng chỉ để tham khảo.
        `;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `credit-report-${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Báo cáo tín dụng đã được tải xuống!');
    }

    // Track events
    trackEvent(eventName, data = {}) {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'trackEvent',
                eventName: eventName,
                data: { source: 'credit_score_checker', ...data }
            });
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'hc-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
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
    window.creditScoreChecker = new CreditScoreChecker();
}
