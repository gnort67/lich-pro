# Lịch Pro

Ứng dụng web tra cứu **lịch âm dương**, **lịch vạn niên**, đếm ngược **ngày lễ nổi bật ở Việt Nam** và hiển thị **ngày chay, ngày rằm** — xây dựng bằng ReactJS, TailwindCSS, hỗ trợ PWA (cài đặt như ứng dụng di động/desktop).

> Thiết kế &amp; phát triển bởi **minhtrong67**

---

## ✨ Tính năng chính

- **Lịch âm dương**: xem lịch theo tháng, mỗi ngày hiển thị cả ngày dương và ngày âm, đánh dấu ngày rằm, mùng một, ngày chay, ngày lễ.
- **Lịch vạn niên**: tra cứu chi tiết một ngày bất kỳ — Can Chi ngày/tháng/năm, con giáp, giờ hoàng đạo; quy đổi qua lại giữa dương lịch và âm lịch.
- **Đếm ngược ngày lễ**: danh sách các ngày lễ, kỷ niệm nổi bật ở Việt Nam (Tết Nguyên Đán, Giỗ Tổ Hùng Vương, Quốc khánh, Trung Thu...) với đồng hồ đếm ngược thời gian thực, lọc theo danh mục.
- **Ngày chay &amp; ngày rằm**: tự động đánh dấu các ngày ăn chay theo lịch "Thập trai" (mùng 1, 8, 14, 15, 18, 23, 24, 28, 29, 30 âm lịch) và ngày rằm/mùng một trong lịch.
- **Cài đặt giao diện**: đổi chế độ sáng/tối/hệ thống, 10 tông màu chủ đề, 5 kiểu chữ (gồm 2 font thuần Việt Times New Roman & Arial), 4 cỡ chữ co giãn toàn ứng dụng — lưu lại trên trình duyệt.
- **Thông báo nhắc nhở**: bật thông báo trình duyệt để không bỏ lỡ ngày chay, ngày rằm, mùng một và các ngày lễ đặc biệt (Tết Dương lịch, Tết Nguyên Đán, Giao thừa...).
- **PWA**: có thể "Cài đặt vào màn hình chính" trên điện thoại/máy tính, hoạt động ngoại tuyến nhờ Service Worker.
- Trải nghiệm mượt: loading skeleton, trạng thái loading/disable cho nút bấm, toast thông báo, responsive chuẩn cho PC, tablet, mobile (giao diện mobile có thanh điều hướng dưới như app thật).

## 🧱 Công nghệ sử dụng

| Thành phần        | Công nghệ                          |
|--------------------|-------------------------------------|
| Framework UI        | ReactJS 18 + React Router (Hash)   |
| Styling             | TailwindCSS 3                       |
| Icon                | lucide-react                        |
| Build tool          | Vite 5                              |
| PWA                 | vite-plugin-pwa (Workbox)           |
| Font                | Be Vietnam Pro, Inter, Nunito (Google Fonts) |
| Thuật toán âm lịch  | Thuật toán thiên văn Hồ Ngọc Đức    |

## 📁 Cấu trúc thư mục

```
lich-pro/
├── public/
│   ├── favicon.svg, favicon.png
│   └── icons/                 # App icon PWA (192/512/maskable)
├── src/
│   ├── components/            # Layout, Sidebar, BottomNav, CalendarGrid, Sheet, Skeleton, Button...
│   ├── contexts/               # SettingsContext (theme), ToastContext
│   ├── data/holidays.js        # Danh sách ngày lễ & ngày chay
│   ├── hooks/useNow.js
│   ├── lib/lunar.js            # Thuật toán chuyển đổi âm dương lịch
│   ├── lib/dateUtils.js
│   ├── pages/                  # HomePage, CalendarPage, VanNienPage, CountdownPage, SettingsPage
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🚀 Bắt đầu

Yêu cầu: Node.js ≥ 18.

```bash
# Cài đặt các gói phụ thuộc
npm install

# Chạy môi trường phát triển
npm run dev

# Build bản production
npm run build

# Xem thử bản production
npm run preview
```

Sau khi chạy `npm run dev`, mở trình duyệt tại địa chỉ được hiển thị (mặc định `http://localhost:5173`).

## 📱 Cài đặt như ứng dụng (PWA)

Sau khi build và deploy (hoặc chạy `npm run preview`), mở trang web trên trình duyệt hỗ trợ (Chrome, Edge, Safari...) và chọn **"Cài đặt ứng dụng" / "Thêm vào màn hình chính"** để sử dụng như một ứng dụng độc lập, hoạt động cả khi ngoại tuyến.

## 🎨 Tuỳ chỉnh giao diện

Vào trang **Cài đặt** trong ứng dụng để:
- Chuyển chế độ Sáng / Tối / Theo hệ thống
- Chọn 1 trong 10 tông màu: Đỏ Son, Vàng Kim, Xanh Ngọc, Xanh Dương, Tím Huế, Hồng Đào, Cam Sen, Ngọc Lam, Chàm Tím, Xám Khói
- Chọn 1 trong 5 kiểu chữ: Be Vietnam Pro, Inter, Nunito, Times New Roman, Arial
- Chọn cỡ chữ: Nhỏ / Vừa / Lớn / Rất lớn

Các tuỳ chỉnh được lưu tự động vào `localStorage` của trình duyệt.

## ⚠️ Lưu ý về dữ liệu

- Thuật toán chuyển đổi âm–dương lịch dựa trên múi giờ GMT+7, độ chính xác cao cho các năm hiện đại.
- Danh sách ngày chay mặc định theo lịch **Thập trai** (10 ngày chay/tháng âm lịch) — một trong các quy ước phổ biến theo truyền thống Phật giáo dân gian; có thể khác với lịch chay của từng tông phái/cá nhân.
- Danh sách ngày lễ tổng hợp các ngày lễ, kỷ niệm phổ biến, mang tính tham khảo.

## 📄 Giấy phép

Dự án được xây dựng cho mục đích học tập/tham khảo cá nhân.

---

**Tác giả:** minhtrong67
