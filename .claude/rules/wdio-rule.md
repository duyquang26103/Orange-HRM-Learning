# Quy tắc dự án test automation — hrmo

## Framework & Stack

- WebdriverIO v9 + Mocha (BDD: describe/it)
- JavaScript, ES modules (import/export)
- baseUrl đã cấu hình: https://opensource-demo.orangehrmlive.com/web/index.php/
  → dùng đường dẫn tương đối: browser.url('/login')

## PHIÊN BẢN API — TUÂN THỦ NGHIÊM NGẶT

Dự án dùng WebdriverIO v9. Chỉ dùng API của v9.

### KHÔNG được dùng (đã bỏ hoặc lỗi thời)

- toHaveTextContaining, toHaveUrlContaining và mọi matcher
  dạng XXXContaining → dùng asymmetric matcher:
  await expect(el).toHaveText(expect.stringContaining('abc'))
- isDisplayedInViewport() → isDisplayed({ withinViewport: true })
- Truy cập trực tiếp elem.selector / elem.elementId
  → dùng getElement() / getElements()
- KHÔNG thêm wdio-chromedriver-service hay driver service nào
  → v9 tự tải driver
- KHÔNG viết code kiểu sync (thiếu await)

### KHÔNG thêm chờ dư thừa

- v9 TỰ chờ element interactable với click() và setValue()
  → KHÔNG gọi waitForDisplayed/waitForClickable trước chúng
- expect-webdriverio TỰ retry assertion
  → KHÔNG thêm wait trước assertion
- Chờ tường minh CHỈ dùng cho: chờ trạng thái nghiệp vụ
  (waitUntil), chờ element biến mất (reverse: true)
- TUYỆT ĐỐI không dùng browser.pause() cố định

### Khi không chắc

Nói rõ là không chắc thay vì đoán. Tôi sẽ tra tài liệu v9.

## Cấu trúc thư mục

- Page Object: test/pageobjects/\*.page.js
- Component dùng chung: test/pageobjects/components/\*.component.js
- Spec: test/specs/\*.spec.js
- Dữ liệu test: test/data/\*.js

## Quy tắc Page Object (BẮT BUỘC)

- Mỗi trang = 1 class, kế thừa base Page
- Element khai báo bằng GETTER, KHÔNG lưu trong constructor:
  get inputEmail () { return $('#Email'); }
- Export SINGLETON: export default new LoginPage()
- KHÔNG đặt assertion trong page object — assertion nằm ở spec
- Action method đặt tên rõ nghĩa: login(), searchProduct()

## Quy tắc Selector (ưu tiên từ trên xuống)

1. ID nếu ổn định (#Email, #Password)
2. name, data-\* attribute
3. text/link text
4. CSS ngắn gọn — TRÁNH XPath dài, TRÁNH class sinh động

## Quy tắc Spec

- Đặt tên it() kèm mã test case nếu có: 'TC01: ...'
- Dùng beforeEach cho setup lặp lại
- Assertion dùng expect-webdriverio: await expect(...)

## Điều KHÔNG được làm

- Không hardcode credentials — đọc từ biến môi trường
- Không tự thêm thư viện ngoài nếu chưa hỏi
