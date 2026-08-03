// Nguồn cấu hình DUY NHẤT cho URL và tài khoản. `import 'dotenv/config'` nạp file `.env`
// vào process.env đúng một lần tại đây; mọi spec / pageobject / flow import từ file này
// thay vì đọc process.env rải rác hoặc hard-code chuỗi trong test.
//
// Fallback = giá trị demo public (an toàn để commit, đã ghi trong README). File `.env`
// (không commit) sẽ override khi chạy môi trường khác. Nhờ fallback này CI vẫn chạy được
// mà không cần cấu hình secret, còn spec thì tuyệt đối không còn giá trị cứng.
import 'dotenv/config';

export const BASE_URL =
    process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/';

export const ADMIN = {
    username: process.env.ADMIN_USERNAME || 'Admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
};
