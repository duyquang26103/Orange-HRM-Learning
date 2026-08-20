---
paths: test/pageobjects/**/*.js
---

# Quy tắc Page Object

- Mỗi trang = 1 class, kế thừa base Page trong page.js
- Element khai báo bằng GETTER, KHÔNG lưu trong constructor:
  get inputEmail () { return $('#Email'); }
- Export SINGLETON: export default new LoginPage()
- KHÔNG đặt assertion trong page object -- assertion nằm ở spec
- Action method đặt tên rõ nghĩa: login(), searchProduct()

## Selector -- ưu tiên từ trên xuống

1. ID nếu ổn định (#Email, #Password)
2. name, data-\* attribute
3. text/link text
4. CSS ngắn gọn -- TRÁNH XPath dài, TRÁNH class sinh động

## Component

Phần giao diện xuất hiện từ 2 trang trở lên → tách sang
components/, KHÔNG kế thừa base Page.

## Đặt tên locator: `descriptor` + `Suffix`

Suffix xác định loại control GUI, ví dụ:

```js
get usernameTxb()        { return $('//input[@name="username"]'); }  // text input
get loginBtn()           { return $('button[type="submit"]'); }      // button
get forgotPasswordLnk()  { return $('.orangehrm-login-forgot'); }    // link
get dashboardLbl()       { return $('//h6[text()="Dashboard"]'); }   // label
```

| Control        | Suffix     | Control          | Suffix |
| --------------- | ---------- | ------------------ | ------ |
| Text input      | `txb`      | List box          | `lbx`  |
| Text            | `txt`      | Label             | `lbl`  |
| Text area       | `txa`      | Image             | `img`  |
| Placeholder     | `plh`      | Icon              | `icn`  |
| Button          | `btn`      | Navigator         | `nav`  |
| Link            | `lnk`      | Modal (pop-up)    | `pup`  |
| Checkbox        | `ckb`      | Pagination        | `pag`  |
| Tab             | `tab`      | iFrame            | `ifr`  |
| Table           | `tbl`      | Progress bar      | `prb`  |
| File upload     | `ful`      | Calendar          | `cal`  |
| Spinner         | `spn`      | Radio button      | `rad`  |
| Drop down       | `ddn`      | List option       | `opt`/`opts` |

Getter cũ (`inputUsername`, `btnSubmit`...) chưa theo convention này —
locator mới bắt buộc theo bảng trên.

## Đặt tên file

`<Name>Page.js` (PascalCase, khớp tên class) trong `test/pageobjects/`,
component dùng chung đặt `<Name>Component.js` trong
`test/pageobjects/components/`.
