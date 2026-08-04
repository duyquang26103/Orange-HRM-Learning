import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, 'fixtures');

export const dataInfo = {
    seedPersonalDetails: {
        firstName: 'Daisy',
        middleName: '',
        lastName: 'Nguyen',
    },
    updateInfo: {
        firstName: 'Jonh',
        lastName: 'Smith',
    },
    invalidPersonalDetails: {
        emptyFirstName: {
            firstName: '',
            expectedError: 'Required',
        },
        futureDOB: {
            dateOfBirth: '2099-01-01',
        },
        dobWrongFormat: {
            dateOfBirth: '32/13/2020',
            expectedError: 'Should be a valid date in dd-mm-yyyy format',
        },
    },
    nationalityToSelect: 'Vietnamese',
    nationalityList: ['Vietnamese', 'American', 'Japanese', 'Sri Lankan'],
    maritalStatusToSelect: 'Single',
    validDOB: {
        input: '1995-05-20',
        displayedAfterSave: '1995-20-05',
    },
    genderToSelect: 'Male',
    employeeId: 'EMP123',
    wrongContact: {
        phone: 'abc123455',
        phoneError: 'Allows numbers and only + - / ( )',
        email: 'wrong@email',
        emailError: 'Expected format: admin@example.com'
    },
    updateContact: {
        street: '123 Le Loi',
        phone: '0909090900',
        city: 'Ho Chi Minh'
    },
    xssAddress: '<script>alert(1)</script>',
    vietnameseName: {
        firstName: 'Nguyễn',
        lastName: 'Đức',
    },
    avatar: {
        validImage: path.join(fixturesDir, 'avatar-valid.jpg'),
        invalidFormatFile: path.join(fixturesDir, 'avatar-invalid-format.pdf'),
        oversizedImage: path.join(fixturesDir, 'avatar-oversized.jpg'),
        invalidFormatError: 'File type not allowed',
        oversizedError: 'Attachment Size Exceeded',
    },
};
