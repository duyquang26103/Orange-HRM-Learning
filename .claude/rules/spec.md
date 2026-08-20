---
paths: test/specs/**/*.js
---

# Quy tắc Spec

- Đặt tên it() kèm mã test case nếu có: 'TC01: ...'
- Dùng beforeEach cho setup lặp lại
- Assertion dùng expect-webdriverio: await expect(...)
- Assertion phải kiểm tra ĐÚNG điều test case mô tả,
  không chỉ 'có gì đó xuất hiện'
- Không hardcode credentials -- đọc từ biến môi trường

## Đặt tên file & describe/it

- File spec: `<Feature>.js` (PascalCase) trong `test/specs/`.
- `describe` = tên module/feature: `describe('Login Module', ...)`.
- `it` = 1 test case, đặt tên `'<TC ID>: <mô tả ngắn>'`; spec sinh từ
  bảng test case dùng ID có prefix module để truy vết nguồn:
  `it('LOGIN_TC01: đăng nhập thành công với tài khoản hợp lệ', ...)`.
- Mỗi `it` là 1 scenario, chạy độc lập được (atomic), không phụ thuộc
  thứ tự hay side effect của test khác.

## `before` vs `beforeEach`

- `before`: chạy 1 lần cho cả `describe`, dùng khi setup dùng chung và
  không bị test làm hỏng (vd: login 1 lần rồi chạy nhiều test search).
- `beforeEach`: chạy trước mỗi `it`, dùng khi cần reset trạng thái để
  test không phụ thuộc lẫn nhau (vd: xen kẽ test đã login/chưa login).
- Ưu tiên reset qua đường nhanh (gọi URL như `auth/logout`) thay vì
  thao tác qua UI.
- Dọn dữ liệu ở `after`/`afterEach` nếu test tạo ra data ảnh hưởng
  đến test khác.
