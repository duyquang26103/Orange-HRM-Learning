// Sinh dữ liệu nhân viên DUY NHẤT mỗi lần chạy bằng timestamp (Date.now()) — tránh trùng
// tên/Employee Id giữa các lần chạy, không cần dọn dữ liệu thủ công.
//
// Lưu ý field: trả về `firstName` / `lastName` (đúng tên tham số mà AddEmployeePage.fillName
// và các spec đang dùng). Trước đây trả về `first_Name` / `last_Name` khiến spec đọc
// `employee.firstName` ra `undefined` -> form không được điền tên.
export function uniqueEmployee(prefix = 'QA') {
    const runId = Date.now();

    return {
        firstName: prefix,
        lastName: `User${String(runId).slice(-6)}`,
        employeeId: `${prefix.charAt(0).toUpperCase()}${String(runId).slice(-8)}`
    };
}

// Giữ tên cũ `EmployUniq` làm alias để các spec đang import không bị vỡ.
export const EmployUniq = uniqueEmployee;
