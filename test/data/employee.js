export const employeeData = {
    validEmployee: {
        firstName: 'Automation',
        middleName: '',
        lastName: 'Tester',
    },
    employeeWithLogin: {
        firstName: 'Automation',
        middleName: '',
        lastName: 'LoginUser',
        username: 'automationLoginUser',
        password: 'Aut0mation@123',
    },
    invalidEmployee: {
        emptyFirstName: {
            firstName: '',
            lastName: 'Tester',
            expectedError: 'Required',
        },
    },
};
