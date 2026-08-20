# Phiên bản API WebdriverIO

Dự án dùng WebdriverIO v9. Chỉ dùng API của v9.

## KHÔNG được dùng (đã bỏ)

- toHaveTextContaining và mọi matcher XXXContaining
  → dùng toHaveText(expect.stringContaining('abc'))
- isDisplayedInViewport() → isDisplayed({ withinViewport: true })
- Truy cập trực tiếp elem.selector / elem.elementId
  → dùng getElement() / getElements()
- KHÔNG thêm wdio-chromedriver-service (v9 tự tải driver)

## KHÔNG thêm chờ dư thừa

- v9 TỰ chờ element interactable với click() và setValue()
- expect-webdriverio TỰ retry assertion
- Chờ tường minh chỉ dùng cho: trạng thái nghiệp vụ (waitUntil),
  element biến mất (reverse: true)
- TUYỆT ĐỐI không dùng browser.pause() cố định

## Khi không chắc

Nói rõ là không chắc thay vì đoán.
