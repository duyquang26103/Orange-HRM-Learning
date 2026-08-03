// Dữ liệu cho PIM module — tách khỏi spec để spec chỉ còn logic, không còn giá trị cứng.
// Data ĐỘNG (unique mỗi lần chạy) không nằm ở đây mà sinh trong spec bằng timestamp /
// helper uniqueEmployee(), vì mỗi lần chạy phải khác nhau.

// Nhân viên tĩnh dùng cho happy-path tạo mới (TC01, TC02).
export const baseEmployee = { firstName: 'John', middleName: 'M', lastName: 'Doe' };

// Bộ case DATA-DRIVEN cho validation "thiếu trường bắt buộc" khi thêm nhân viên.
// Cùng hành động (mở form -> điền -> save) + cùng assertion (đúng 1 lỗi validation, URL
// vẫn ở addEmployee), chỉ khác dữ liệu đầu vào -> gộp bằng forEach thay vì viết lặp thân test.
export const requiredFieldCases = [
    { tcId: 'PIM_TC03', description: 'bỏ trống First Name', name: { lastName: 'Doe' } },
    { tcId: 'PIM_TC04', description: 'bỏ trống Last Name', name: { firstName: 'John' } }
];

// Contact Details (TC11, TC12).
export const contactDetails = { address: '123 St', mobile: '0900000000' };
export const invalidMobile = 'abc123xyz';

// Login details khi tạo nhân viên có tài khoản (TC13, TC14).
export const validLoginPassword = 'Pass@123';
export const weakPassword = '123';
