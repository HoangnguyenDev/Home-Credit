// Smart Loan Calculator Feature
// Provides advanced loan calculation capabilities

class LoanCalculator {
    constructor() {
        this.setupEventListeners();
    }

    // Calculate monthly payment using loan formula
    calculateMonthlyPayment(principal, annualRate, termMonths) {
        const monthlyRate = annualRate / 100 / 12;
        if (monthlyRate === 0) return principal / termMonths;
        
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1);
        
        return monthlyPayment;
    }

    // Calculate total payment and interest
    calculateLoanDetails(principal, annualRate, termMonths) {
        const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, termMonths);
        const totalPayment = monthlyPayment * termMonths;
        const totalInterest = totalPayment - principal;
        
        return {
            monthlyPayment: Math.round(monthlyPayment),
            totalPayment: Math.round(totalPayment),
            totalInterest: Math.round(totalInterest),
            principal: principal,
            interestRate: annualRate,
            termMonths: termMonths
        };
    }

    // Calculate maximum loan amount based on income
    calculateMaxLoanAmount(monthlyIncome, debtToIncomeRatio = 0.4) {
        const maxMonthlyPayment = monthlyIncome * debtToIncomeRatio;
        return {
            maxMonthlyPayment: Math.round(maxMonthlyPayment),
            recommendedAmount: Math.round(maxMonthlyPayment * 36), // 3 years
            conservativeAmount: Math.round(maxMonthlyPayment * 24)  // 2 years
        };
    }

    // Get loan recommendations based on purpose
    getLoanRecommendations(loanPurpose, amount) {
        const recommendations = {
            'cash-advance': {
                maxAmount: 200000000, // 200M VND
                interestRate: 1.67, // %/month
                termOptions: [6, 12, 18, 24, 36],
                features: ['Duyệt nhanh 3 phút', 'Giải ngân trong ngày', 'Không cần thế chấp']
            },
            'credit-card': {
                maxAmount: 100000000, // 100M VND
                interestRate: 2.5, // %/month
                termOptions: [12, 24, 36],
                features: ['Hoàn tiền 10%', 'Miễn phí thường niên', 'Ưu đãi mua sắm']
            },
            'electronics': {
                maxAmount: 50000000, // 50M VND
                interestRate: 0, // 0% promotional rate
                termOptions: [6, 12, 18],
                features: ['Lãi suất 0%', 'Không cần trả trước', 'Bảo hành mở rộng']
            },
            'motorbike': {
                maxAmount: 80000000, // 80M VND
                interestRate: 1.39, // %/month
                termOptions: [12, 24, 36],
                features: ['Thủ tục đơn giản', 'Duyệt nhanh', 'Ưu đãi bảo hiểm']
            }
        };

        return recommendations[loanPurpose] || recommendations['cash-advance'];
    }

    // Create calculator modal
    createCalculatorModal() {
        const modal = document.createElement('div');
        modal.className = 'hc-calculator-modal hc-extension-reset';
        modal.innerHTML = `
            <div class="hc-calculator-overlay" onclick="this.parentElement.remove()"></div>
            <div class="hc-calculator-content">
                <div class="hc-calculator-header">
                    <h3>🧮 Máy Tính Vay Home Credit</h3>
                    <button class="hc-close-btn" onclick="this.closest('.hc-calculator-modal').remove()">×</button>
                </div>
                
                <div class="hc-calculator-tabs">
                    <button class="hc-tab-btn active" data-tab="payment">Tính khoản thanh toán</button>
                    <button class="hc-tab-btn" data-tab="amount">Tính số tiền vay tối đa</button>
                    <button class="hc-tab-btn" data-tab="compare">So sánh sản phẩm</button>
                </div>

                <div class="hc-tab-content active" id="payment-tab">
                    <div class="hc-input-group">
                        <label>Số tiền vay (VND)</label>
                        <input type="number" id="loan-amount" placeholder="50,000,000" value="50000000">
                        <div class="hc-amount-buttons">
                            <button onclick="document.getElementById('loan-amount').value = '20000000'">20M</button>
                            <button onclick="document.getElementById('loan-amount').value = '50000000'">50M</button>
                            <button onclick="document.getElementById('loan-amount').value = '100000000'">100M</button>
                            <button onclick="document.getElementById('loan-amount').value = '200000000'">200M</button>
                        </div>
                    </div>

                    <div class="hc-input-group">
                        <label>Lãi suất (%/tháng)</label>
                        <input type="number" id="interest-rate" placeholder="1.67" value="1.67" step="0.01">
                    </div>

                    <div class="hc-input-group">
                        <label>Thời hạn vay (tháng)</label>
                        <select id="loan-term">
                            <option value="6">6 tháng</option>
                            <option value="12" selected>12 tháng</option>
                            <option value="18">18 tháng</option>
                            <option value="24">24 tháng</option>
                            <option value="36">36 tháng</option>
                        </select>
                    </div>

                    <button class="hc-calculate-btn" onclick="window.loanCalculator.calculateAndDisplay()">
                        💰 Tính toán ngay
                    </button>

                    <div class="hc-result" id="calculation-result" style="display: none;">
                        <h4>Kết quả tính toán:</h4>
                        <div class="hc-result-item">
                            <span>Trả hàng tháng:</span>
                            <strong id="monthly-payment">0 VND</strong>
                        </div>
                        <div class="hc-result-item">
                            <span>Tổng số tiền trả:</span>
                            <strong id="total-payment">0 VND</strong>
                        </div>
                        <div class="hc-result-item">
                            <span>Tổng lãi phải trả:</span>
                            <strong id="total-interest">0 VND</strong>
                        </div>
                        
                        <div class="hc-result-actions">
                            <button class="hc-apply-btn" onclick="window.loanCalculator.applyForLoan()">
                                ⚡ Đăng ký vay ngay
                            </button>
                            <button class="hc-compare-btn" onclick="window.loanCalculator.compareProducts()">
                                📊 So sánh sản phẩm
                            </button>
                        </div>
                    </div>
                </div>

                <div class="hc-tab-content" id="amount-tab">
                    <div class="hc-input-group">
                        <label>Thu nhập hàng tháng (VND)</label>
                        <input type="number" id="monthly-income" placeholder="20,000,000" value="20000000">
                    </div>

                    <div class="hc-input-group">
                        <label>Tỷ lệ nợ/thu nhập (%)</label>
                        <select id="debt-ratio">
                            <option value="0.3">30% (An toàn)</option>
                            <option value="0.4" selected>40% (Khuyến nghị)</option>
                            <option value="0.5">50% (Tối đa)</option>
                        </select>
                    </div>

                    <button class="hc-calculate-btn" onclick="window.loanCalculator.calculateMaxAmount()">
                        🎯 Tính số tiền vay tối đa
                    </button>

                    <div class="hc-result" id="max-amount-result" style="display: none;">
                        <h4>Khả năng vay của bạn:</h4>
                        <div class="hc-result-item">
                            <span>Khoản thanh toán tối đa/tháng:</span>
                            <strong id="max-monthly">0 VND</strong>
                        </div>
                        <div class="hc-result-item success">
                            <span>Số tiền khuyến nghị (3 năm):</span>
                            <strong id="recommended-amount">0 VND</strong>
                        </div>
                        <div class="hc-result-item">
                            <span>Số tiền an toàn (2 năm):</span>
                            <strong id="conservative-amount">0 VND</strong>
                        </div>
                    </div>
                </div>

                <div class="hc-tab-content" id="compare-tab">
                    <div class="hc-product-comparison">
                        <h4>So sánh sản phẩm Home Credit</h4>
                        <div class="hc-comparison-grid" id="comparison-grid">
                            <!-- Products will be populated here -->
                        </div>
                    </div>
                </div>

                <div class="hc-calculator-footer">
                    <small>
                        💡 Kết quả chỉ mang tính chất tham khảo. 
                        Lãi suất và điều kiện cuối cùng do Home Credit quyết định.
                    </small>
                </div>
            </div>
        `;

        return modal;
    }

    // Format number as Vietnamese currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Calculate and display results
    calculateAndDisplay() {
        const amount = parseFloat(document.getElementById('loan-amount').value);
        const rate = parseFloat(document.getElementById('interest-rate').value);
        const term = parseInt(document.getElementById('loan-term').value);

        if (!amount || !rate || !term) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const result = this.calculateLoanDetails(amount, rate * 12, term); // Convert to annual rate

        document.getElementById('monthly-payment').textContent = this.formatCurrency(result.monthlyPayment);
        document.getElementById('total-payment').textContent = this.formatCurrency(result.totalPayment);
        document.getElementById('total-interest').textContent = this.formatCurrency(result.totalInterest);
        
        document.getElementById('calculation-result').style.display = 'block';

        // Track calculation event
        this.trackEvent('loan_calculated', {
            amount: amount,
            rate: rate,
            term: term,
            monthlyPayment: result.monthlyPayment
        });
    }

    // Calculate maximum loan amount
    calculateMaxAmount() {
        const income = parseFloat(document.getElementById('monthly-income').value);
        const ratio = parseFloat(document.getElementById('debt-ratio').value);

        if (!income) {
            alert('Vui lòng nhập thu nhập hàng tháng!');
            return;
        }

        const result = this.calculateMaxLoanAmount(income, ratio);

        document.getElementById('max-monthly').textContent = this.formatCurrency(result.maxMonthlyPayment);
        document.getElementById('recommended-amount').textContent = this.formatCurrency(result.recommendedAmount);
        document.getElementById('conservative-amount').textContent = this.formatCurrency(result.conservativeAmount);
        
        document.getElementById('max-amount-result').style.display = 'block';

        // Track max amount calculation
        this.trackEvent('max_amount_calculated', {
            income: income,
            ratio: ratio,
            maxAmount: result.recommendedAmount
        });
    }

    // Apply for loan
    applyForLoan() {
        const amount = document.getElementById('loan-amount').value;
        const term = document.getElementById('loan-term').value;
        
        // Track application intent
        this.trackEvent('loan_application_intent', {
            amount: amount,
            term: term,
            source: 'calculator'
        });

        // Open Home Credit application page
        if (chrome && chrome.tabs) {
            chrome.tabs.create({ 
                url: `https://www.homecredit.vn/vay-tien-mat?amount=${amount}&term=${term}` 
            });
        } else {
            window.open(`https://www.homecredit.vn/vay-tien-mat?amount=${amount}&term=${term}`, '_blank');
        }

        // Close calculator
        document.querySelector('.hc-calculator-modal').remove();
    }

    // Compare products
    compareProducts() {
        const amount = parseFloat(document.getElementById('loan-amount').value) || 50000000;
        
        // Switch to compare tab
        document.querySelectorAll('.hc-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.hc-tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector('[data-tab="compare"]').classList.add('active');
        document.getElementById('compare-tab').classList.add('active');
        
        this.populateProductComparison(amount);
    }

    // Populate product comparison
    populateProductComparison(amount) {
        const products = [
            {
                name: 'Vay tiền mặt',
                type: 'cash-advance',
                rate: 1.67,
                maxAmount: 200000000,
                features: ['Duyệt nhanh 3 phút', 'Giải ngân trong ngày']
            },
            {
                name: 'Thẻ tín dụng',
                type: 'credit-card', 
                rate: 2.5,
                maxAmount: 100000000,
                features: ['Hoàn tiền 10%', 'Miễn phí thường niên']
            },
            {
                name: 'Vay điện máy',
                type: 'electronics',
                rate: 0,
                maxAmount: 50000000,
                features: ['Lãi suất 0%', 'Không cần trả trước']
            }
        ];

        const grid = document.getElementById('comparison-grid');
        grid.innerHTML = products.map(product => {
            const applicable = amount <= product.maxAmount;
            const monthlyPayment = applicable ? 
                this.calculateMonthlyPayment(amount, product.rate * 12, 12) : 0;

            return `
                <div class="hc-product-card ${applicable ? 'applicable' : 'not-applicable'}">
                    <h5>${product.name}</h5>
                    <div class="hc-product-rate">
                        Lãi suất: <strong>${product.rate}%/tháng</strong>
                    </div>
                    <div class="hc-product-max">
                        Tối đa: ${this.formatCurrency(product.maxAmount)}
                    </div>
                    ${applicable ? `
                        <div class="hc-product-payment">
                            Trả hàng tháng: <strong>${this.formatCurrency(monthlyPayment)}</strong>
                        </div>
                    ` : `
                        <div class="hc-product-warning">
                            Số tiền vượt quá hạn mức
                        </div>
                    `}
                    <div class="hc-product-features">
                        ${product.features.map(f => `<span class="hc-feature">✓ ${f}</span>`).join('')}
                    </div>
                    ${applicable ? `
                        <button class="hc-select-product" onclick="window.loanCalculator.selectProduct('${product.type}')">
                            Chọn sản phẩm này
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    // Select product
    selectProduct(productType) {
        const urls = {
            'cash-advance': 'https://www.homecredit.vn/vay-tien-mat',
            'credit-card': 'https://www.homecredit.vn/the-tin-dung',
            'electronics': 'https://www.homecredit.vn/vay-tra-gop-dien-may'
        };

        this.trackEvent('product_selected', { 
            productType: productType,
            source: 'calculator_comparison' 
        });

        if (chrome && chrome.tabs) {
            chrome.tabs.create({ url: urls[productType] });
        } else {
            window.open(urls[productType], '_blank');
        }

        document.querySelector('.hc-calculator-modal').remove();
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('hc-tab-btn')) {
                const tabName = e.target.dataset.tab;
                
                // Remove active from all tabs
                document.querySelectorAll('.hc-tab-btn').forEach(btn => 
                    btn.classList.remove('active'));
                document.querySelectorAll('.hc-tab-content').forEach(content => 
                    content.classList.remove('active'));
                
                // Add active to clicked tab
                e.target.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            }
        });
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

    // Show calculator
    show() {
        // Remove existing calculator if any
        const existing = document.querySelector('.hc-calculator-modal');
        if (existing) existing.remove();

        // Create and show new calculator
        const modal = this.createCalculatorModal();
        document.body.appendChild(modal);

        // Track calculator opened
        this.trackEvent('calculator_opened', { source: 'extension' });
    }
}

// Initialize calculator
window.loanCalculator = new LoanCalculator();
