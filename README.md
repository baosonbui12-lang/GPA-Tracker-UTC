# 🎓 UTC GPA Tracker - Hệ thống Quản lý Điểm số Sinh viên

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC292B?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)

Một ứng dụng Fullstack (Frontend + Backend + Database) được thiết kế dành riêng cho việc theo dõi, quản lý và thống kê điểm số (GPA) qua các học kỳ. Hệ thống được tinh chỉnh logic tính điểm chuẩn xác theo quy chế đào tạo, giúp sinh viên CNTT dễ dàng nắm bắt lộ trình học tập 142 tín chỉ của mình.

## ✨ Tính năng nổi bật

- **🔒 Xác thực người dùng:** Hệ thống Đăng ký / Đăng nhập an toàn. Phân lập dữ liệu (Data Isolation) đảm bảo mỗi tài khoản chỉ xem và quản lý bảng điểm của riêng mình. Có hỗ trợ "Chế độ Khách" (Guest Mode).
- **📚 Quản lý Môn học:** Thêm, xóa môn học theo từng học kỳ linh hoạt (Hỗ trợ lộ trình 4 năm - 8 học kỳ).
- **🧮 Auto-Calculate GPA:** Tự động tính toán Tổng tín chỉ và điểm GPA theo cả 2 hệ (Học kỳ hiện tại & Tích lũy toàn khóa). Tự động quy đổi điểm Hệ 10 sang Hệ 4 và Điểm chữ chuẩn xác.
- **📈 Trực quan hóa dữ liệu:** Tích hợp biểu đồ đường (Line Chart) theo dõi biến động điểm số qua từng học kỳ, mang lại cái nhìn tổng quan về tiến độ học tập.
- **🎨 Giao diện hiện đại:** Thiết kế Dark Mode phong cách Glassmorphism chuyên nghiệp, thân thiện và hoàn toàn Responsive.

## 🛠 Công nghệ sử dụng

- **Frontend:** React.js (Vite), Axios (gọi API), Recharts (vẽ biểu đồ đồ thị), Thuần CSS3.
- **Backend:** Java Spring Boot, Spring Data JPA, Hibernate RESTful API.
- **Database:** Microsoft SQL Server.

## 🚀 Hướng dẫn Cài đặt & Chạy dự án (Local)

### 1. Cài đặt Cơ sở dữ liệu (SQL Server)
1. Tạo một database mới tên là `GPA_Tracker`.
2. Chạy ứng dụng Spring Boot (Backend) để Hibernate tự động sinh các bảng (`Users`, `Courses`, `Semesters`).
3. Mở SSMS, chạy script sau để thêm dữ liệu mốc học kỳ:
   ```sql
   INSERT INTO Semesters (plan_id, term_name) VALUES 
   (1, N'Học kỳ 1 - Năm 1'), (1, N'Học kỳ 2 - Năm 1'),
   (1, N'Học kỳ 1 - Năm 2'), (1, N'Học kỳ 2 - Năm 2'),
   (1, N'Học kỳ 1 - Năm 3'), (1, N'Học kỳ 2 - Năm 3'),
   (1, N'Học kỳ 1 - Năm 4'), (1, N'Học kỳ 2 - Năm 4');
### 2. Cài đặt FrontEnd(React)
Mở Terminal, di chuyển vào thư mục chứa code FrontEnd và chạy các lệnh sau:
# Cài đặt các thư viện cần thiết (bao gồm axios, recharts)
npm install

# Khởi động server phát triển
npm run dev

Truy cập vào "http://localhost:5173" trên trình duyệt để trải nghiệm ứng dụng.
### Ảnh chụp màn hình:
<img width="1918" height="965" alt="Hình đăng nhập" src="https://github.com/user-attachments/assets/a9690a6f-9569-4492-b023-5e4079e5f8b1" />
<img width="1891" height="965" alt="Hình sử dụng " src="https://github.com/user-attachments/assets/4eb12126-9c04-468c-984e-d40d84095e0b" />

Phát triển bởi [Bùi Bảo Sơn]

