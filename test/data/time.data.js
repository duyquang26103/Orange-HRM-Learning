export const adminUser = {
  username: process.env.ADMIN_USERNAME || "Admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

export const invalidHourCases = [
  { id: "TIME_TC04", title: "Nhập giờ chứa ký tự chữ", value: "abc" },
  { id: "TIME_TC05", title: "Nhập giờ vượt quá 24h / ngày", value: "30" },
];
