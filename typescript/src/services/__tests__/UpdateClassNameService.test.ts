import {
  validateUpdateClassNameRequest,
  updateClassNameByClassCode,
} from 'services/UpdateClassNameService';

describe('testing UpdateClassNameService', () => {
  test('validateUpdateClassNameRequest should return BAD_REQUEST error when either parameters is empty', () => {
    expect(() => {
      validateUpdateClassNameRequest('', 'P1-1');
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateUpdateClassNameRequest('P1-1', '');
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateUpdateClassNameRequest('', '');
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateUpdateClassNameRequest('P1-1', 'P1 Integrity');
    }).not.toThrow();
  });

  /* test('updateClassNameByClassCode should return BAD_REQUEST error when class cannot be found', () => {
    expect(() => {
      updateClassNameByClassCode(
        'class code that cannot be found',
        'P1 Integrity'
      );
    }).toThrowError(new Error('BAD_REQUEST'));
  }); */
});
