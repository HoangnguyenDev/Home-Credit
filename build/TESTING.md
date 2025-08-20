# Hướng Dẫn Test Extension Home Credit Vietnam

## 📋 Checklist Test Extension

### 1. Cài Đặt Extension Để Test

1. Mở Chrome và vào `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Nhấn **Load unpacked**
4. Chọn thư mục `e:\banbacklink\chrome\homecredit`
5. Extension sẽ xuất hiện trong danh sách

### 2. Test Popup Interface

#### ✅ Test Cơ Bản

- [ ] Click vào icon extension trên toolbar
- [ ] Popup hiển thị đúng kích thước (380x500px)
- [ ] Logo Home Credit hiển thị
- [ ] Màu sắc đúng brand (#FF6B35, #F7931E)
- [ ] Font chữ đẹp và dễ đọc

#### ✅ Test Navigation

- [ ] Click "Vay Tiêu Dùng" → mở tab mới
- [ ] Click "Thẻ Tín Dụng" → mở tab mới
- [ ] Click "Bảo Hiểm" → mở tab mới
- [ ] Click "Mở Tài Khoản" → mở tab mới
- [ ] Click "Kiểm Tra Điểm Tín Dụng" → mở tab mới

#### ✅ Test Quick Actions

- [ ] Hover hiệu ứng trên các button
- [ ] Animation smooth không giật lag
- [ ] Click "Liên Hệ" → hiển thị thông tin
- [ ] Click "Chi Nhánh" → mở Google Maps

### 3. Test Content Script

#### ✅ Test Trên Trang Home Credit

1. Vào <https://www.homecredit.vn>
2. Kiểm tra:

   - [ ] Form validation hoạt động
   - [ ] Floating button xuất hiện
   - [ ] Content enhancement áp dụng
   - [ ] CSS injection không conflict

#### ✅ Test Trên Trang Khác

1. Vào trang ngân hàng khác (VCB, TCB, etc.)
2. Kiểm tra:

   - [ ] Financial keywords được detect
   - [ ] Floating button hiển thị khi có từ khóa tài chính
   - [ ] Modal form hoạt động

### 4. Test Background Service Worker

#### ✅ Test Page Detection
1. Mở Chrome DevTools (`F12`)
2. Vào tab **Application** → **Service Workers**
3. Kiểm tra Home Credit Extension service worker hoạt động
4. Vào các trang:
   - [ ] homecredit.vn → Badge hiển thị
   - [ ] Trang ngân hàng → Có notification
   - [ ] Trang thường → Không có gì

#### ✅ Test Storage & Analytics
1. Vào **Application** → **Storage** → **Extension storage**
2. Kiểm tra:
   - [ ] User preferences được lưu
   - [ ] Analytics events được ghi
   - [ ] Visit count tăng dần

### 5. Test Performance

#### ✅ Test Memory Usage
1. Mở **Task Manager** (`Shift + Esc`)
2. Kiểm tra:
   - [ ] Extension không tiêu tốn quá nhiều CPU
   - [ ] Memory usage < 50MB
   - [ ] Không có memory leak

#### ✅ Test Loading Speed
- [ ] Popup mở nhanh (< 200ms)
- [ ] Content script inject không làm chậm trang
- [ ] Background script không block UI

### 6. Test Browser Compatibility

#### ✅ Test Chrome Versions
- [ ] Chrome 120+ (latest)
- [ ] Chrome 110+ (older but supported)

#### ✅ Test Operating Systems
- [ ] Windows 10/11
- [ ] macOS
- [ ] Linux (nếu có)

### 7. Test Security & Privacy

#### ✅ Test Permissions
1. Right click extension → **Manage Extension**
2. Kiểm tra permissions:
   - [ ] Chỉ request permissions cần thiết
   - [ ] Không access data không liên quan
   - [ ] Host permissions chỉ cho homecredit.vn

#### ✅ Test Data Privacy
- [ ] Không gửi dữ liệu user ra ngoài
- [ ] Analytics chỉ track hành vi cần thiết
- [ ] Tuân thủ privacy policy

### 8. Test Error Handling

#### ✅ Test Network Errors
1. Tắt mạng và test:
   - [ ] Extension vẫn hoạt động cơ bản
   - [ ] Hiển thị error message thân thiện
   - [ ] Không crash browser

#### ✅ Test Invalid Data
- [ ] Input form với dữ liệu sai
- [ ] Extension handle gracefully
- [ ] Console không có error đỏ

### 9. Test Mobile/Responsive

#### ✅ Test Chrome Mobile
1. Enable mobile emulation trong DevTools
2. Test popup interface:
   - [ ] Responsive design
   - [ ] Touch-friendly buttons
   - [ ] Text readable trên màn hình nhỏ

### 10. Test Before Publishing

#### ✅ Final Checklist
- [ ] Tất cả icons đã thay thế (không còn placeholder)
- [ ] Manifest.json đầy đủ thông tin
- [ ] README.md cập nhật
- [ ] Code đã được format đẹp
- [ ] Console.log debug đã xóa
- [ ] Version number phù hợp

---

## 🐛 Common Issues & Solutions

### Issue: Extension không load
**Solution:** Kiểm tra manifest.json syntax, reload extension

### Issue: Popup không hiển thị
**Solution:** Kiểm tra popup.html path trong manifest

### Issue: Content script không hoạt động  
**Solution:** Kiểm tra matches patterns, permissions

### Issue: Service Worker bị crash
**Solution:** Kiểm tra background.js syntax, event listeners

---

## 🚀 Performance Optimization Tips

1. **Lazy Loading:** Chỉ load code khi cần
2. **Debounce Events:** Tránh gọi quá nhiều events
3. **Minimize DOM Access:** Cache DOM elements
4. **Optimize Images:** Compress icon files
5. **Clean Up:** Remove unused code/dependencies

---

## 📞 Support & Debugging

### Chrome Extension Logs
```
chrome://extensions/ → Details → Inspect views
```

### Service Worker Console
```
chrome://extensions/ → Details → Service Worker → Inspect
```

### Content Script Console
```
F12 → Console (trên trang có content script)
```

---

**✅ Test completed successfully → Ready for Chrome Web Store submission!**
