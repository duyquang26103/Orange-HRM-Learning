export const validUser = {
    username: 'Admin',
    password: 'admin123'
};

// đăng nhập thất bại
export const invalidLoginCases = [
    {
        tcId: 'LOGIN_TC02',
        description: 'đăng nhập thất bại với password sai',
        username: 'Admin',
        password: 'wrongpass',
        waitTimeout: 10000
    },
    {
        tcId: 'LOGIN_TC03',
        description: 'đăng nhập thất bại với username sai',
        username: 'NotExist',
        password: 'admin123'
    },
    {
        tcId: 'LOGIN_TC09',
        description: 'password phân biệt hoa thường',
        username: 'Admin',
        password: 'Admin123'
    },
    {
        tcId: 'LOGIN_TC10',
        description: 'SQL Injection cơ bản trong username',
        username: "' OR '1'='1",
        password: 'abc'
    },
    {
        tcId: 'LOGIN_TC19',
        description: 'username quá dài (>255 ký tự)',
        username: 'a'.repeat(300),
        password: 'admin123',
        waitTimeout: 15000
    },
    {
        tcId: 'LOGIN_TC20',
        description: 'ký tự đặc biệt Unicode trong username',
        username: 'Adminñ日本',
        password: 'admin123'
    }
];
