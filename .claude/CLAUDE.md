# Quy tắc dự án test automation — hrmo

Quy tắc chi tiết theo từng thư mục/chủ đề nằm trong `.claude/rules/`:
[wdio-v9-api.md](rules/wdio-v9-api.md) (API version — áp dụng toàn dự án),
[page-objects.md](rules/page-objects.md) (`paths: test/pageobjects/**/*.js`),
[spec.md](rules/spec.md) (`paths: test/specs/**/*.js`).
Phần dưới đây là quy tắc còn lại, áp dụng cho toàn bộ dự án.

## Framework & Stack

- WebdriverIO v9 + Mocha (BDD: describe/it)
- JavaScript, ES modules (import/export)
- baseUrl đã cấu hình: https://opensource-demo.orangehrmlive.com/web/index.php/
  → dùng đường dẫn tương đối: browser.url('/login')

## Cấu trúc thư mục

- Page Object: test/pageobjects/\*.js
- Component dùng chung: test/pageobjects/components/\*.js
- Spec: test/specs/\*.js
- Dữ liệu test: test/data/\*.js

## Điều KHÔNG được làm

- Không hardcode credentials — đọc từ biến môi trường
- Không tự thêm thư viện ngoài nếu chưa hỏi
