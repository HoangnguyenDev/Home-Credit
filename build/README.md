# Home Credit Vietnam - Chrome Extension

🏛️ **Extension tài chính số toàn diện cho người dùng Home Credit Việt Nam**

## 🌟 Tính năng chính

### 💰 **Quản lý tài chính thông minh**
- **🧮 Máy tính vay nâng cao**: Tính toán khoản vay với nhiều tùy chọn
- **📊 Theo dõi chi tiêu**: Quản lý ngân sách và phân tích chi tiêu  
- **⭐ Kiểm tra điểm tín dụng**: Đánh giá và cải thiện điểm tín dụng
- **📈 Bảng điều khiển tài chính**: Tổng quan sức khỏe tài chính

### 🔔 **Hệ thống thông báo AI**
- **Thông báo thông minh**: AI phân tích hành vi để gửi thông báo phù hợp
- **Cá nhân hóa nội dung**: Đề xuất sản phẩm dựa trên sở thích
- **Quản lý thông báo**: Cài đặt chi tiết cho từng loại thông báo
- **Phân tích hành vi**: Thống kê và insights về thói quen tài chính

### 🚀 **Trải nghiệm người dùng**
- **Giao diện hiện đại**: Thiết kế responsive, đẹp mắt
- **Hiệu suất cao**: Tối ưu hóa tốc độ, ít tài nguyên
- **Bảo mật**: Dữ liệu lưu trữ cục bộ, không gửi ra ngoài
- **Đa ngôn ngữ**: Hỗ trợ tiếng Việt đầy đủ

## 📁 Cấu trúc dự án

```
chrome-extension/
├── manifest.json           # Cấu hình extension
├── popup.html             # Giao diện popup chính  
├── popup.css              # Styles cho popup
├── popup.js               # Logic popup
├── content.js             # Content script
├── content.css            # Styles cho content script
├── background.js          # Service worker
├── features/              # Các tính năng chính
│   ├── calculator.js      # Máy tính vay
│   ├── calculator.css     
│   ├── dashboard.js       # Bảng điều khiển
│   ├── dashboard.css      
│   ├── credit-score.js    # Kiểm tra điểm tín dụng
│   ├── credit-score.css   
│   ├── expense-tracker.js # Theo dõi chi tiêu
│   ├── expense-tracker.css
│   ├── smart-notifications.js # Thông báo thông minh
│   └── smart-notifications.css
└── icons/                 # Icons và assets
    ├── icon-16.png
    ├── icon-32.png  
    ├── icon-48.png
    └── icon-128.png
```

## 🛠️ Cài đặt và phát triển

### Yêu cầu
- Chrome 88+ hoặc Edge 88+
- Node.js 16+ (cho development)

### Cài đặt từ source
```bash
# Clone repository
git clone <repository-url>
cd chrome-extension

# Cài đặt dependencies (nếu có)
npm install

# Build extension (nếu cần)
npm run build
```

### Load extension trong Chrome
1. Mở `chrome://extensions/`
2. Bật **Developer mode**
3. Click **Load unpacked**
4. Chọn thư mục extension
5. Extension sẽ xuất hiện trong toolbar

## 🎯 Hướng dẫn sử dụng

### 🧮 Máy tính vay
1. Click icon extension → **"Máy tính vay"**
2. Nhập số tiền cần vay
3. Chọn thời hạn và lãi suất
4. Xem kết quả tính toán chi tiết
5. So sánh các gói vay khác nhau

### ⭐ Kiểm tra điểm tín dụng  
1. Click **"Kiểm tra điểm tín dụng"**
2. Nhập thông tin cơ bản
3. Xem điểm tín dụng ước tính
4. Nhận gợi ý cải thiện
5. Theo dõi lịch sử điểm số

### 📊 Theo dõi chi tiêu
1. Click **"Theo dõi chi tiêu"**  
2. Thêm các khoản chi tiêu
3. Phân loại theo danh mục
4. Đặt ngân sách hàng tháng
5. Xem báo cáo và biểu đồ

### 🔔 Thông báo thông minh
1. Click **"Thông báo thông minh"**
2. Cài đặt sở thích thông báo
3. Đặt giờ yên tĩnh  
4. Chọn loại thông báo muốn nhận
5. Xem thống kê và insights

## 🔧 Tính năng kỹ thuật

### Công nghệ sử dụng
- **Manifest V3**: Chrome Extension API mới nhất
- **Vanilla JavaScript**: Không dependency, hiệu suất cao
- **CSS3**: Animations, Grid, Flexbox
- **Canvas API**: Vẽ biểu đồ và visualizations
- **Chrome Storage API**: Lưu trữ dữ liệu cục bộ
- **Chrome Notifications API**: Thông báo hệ thống

### Tối ưu hóa hiệu suất
- **Lazy loading**: Chỉ load tính năng khi cần
- **Modular architecture**: Tách biệt từng feature
- **Efficient storage**: Nén và cache dữ liệu
- **Minimal dependencies**: Giảm thiểu external libraries

### Bảo mật và quyền riêng tư
- **Local-first**: Dữ liệu lưu trên máy người dùng
- **No tracking**: Không thu thập dữ liệu cá nhân
- **Secure permissions**: Chỉ yêu cầu quyền cần thiết
- **Data encryption**: Mã hóa dữ liệu nhạy cảm (nếu có)

## 📊 Analytics và Tracking

Extension thu thập các metrics sau để cải thiện trải nghiệm:
- **Feature usage**: Tính năng nào được sử dụng nhiều nhất
- **User journey**: Luồng sử dụng của người dùng  
- **Performance metrics**: Thời gian tải, memory usage
- **Error tracking**: Lỗi và crash reports

> 🔒 **Lưu ý**: Tất cả analytics được lưu cục bộ, không gửi về server

## 🧪 Testing

Chạy test suite:
```bash
# Test tất cả tính năng
npm test

# Test specific feature  
npm test calculator

# Test trên PowerShell (Windows)
pwsh -File test-features.ps1
```

## 🚀 Deployment

### Publish lên Chrome Web Store
1. Zip toàn bộ source code
2. Upload lên [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Điền thông tin extension
4. Submit for review

### Update version
1. Cập nhật `version` trong `manifest.json`
2. Rebuild extension
3. Upload bản mới

## 🤝 Đóng góp

### Báo lỗi
- Mở issue trên GitHub
- Mô tả chi tiết lỗi và cách tái hiện
- Attach screenshots nếu có

### Đề xuất tính năng
- Fork repository
- Tạo branch mới: `feature/ten-tinh-nang`
- Implement và test kỹ
- Tạo Pull Request

### Code style
- Sử dụng ESLint configuration
- Comment code tiếng Việt
- Follow naming conventions

## 📝 Changelog

### Version 2.0.0 (Latest)
- ✨ **NEW**: Kiểm tra điểm tín dụng với AI analysis
- ✨ **NEW**: Theo dõi chi tiêu và quản lý ngân sách  
- ✨ **NEW**: Hệ thống thông báo thông minh với behavioral analysis
- 🎨 **IMPROVED**: Giao diện popup hoàn toàn mới
- ⚡ **PERFORMANCE**: Tối ưu hóa loading time 50%
- 🔒 **SECURITY**: Enhanced data encryption

### Version 1.0.0
- 🧮 Máy tính vay cơ bản
- 📈 Bảng điều khiển tài chính
- 🔔 Thông báo đơn giản
- 🎨 Giao diện cơ bản

## 📞 Hỗ trợ

- **Email**: support@homecredit.vn
- **Hotline**: 1900 9998
- **Website**: [homecredit.vn](https://www.homecredit.vn)
- **Docs**: [Xem tài liệu chi tiết](./TESTING.md)

## 📄 License

Copyright © 2024 Home Credit Vietnam. All rights reserved.

---

<div align="center">

**🏛️ Home Credit Vietnam - Tài chính số toàn diện**

*Được phát triển với ❤️ tại Việt Nam*

</div>
