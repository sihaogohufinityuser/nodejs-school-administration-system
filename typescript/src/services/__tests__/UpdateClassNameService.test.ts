import { Op } from 'sequelize';
import Class from 'models/Class';
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

  test('updateClassNameByClassCode should return BAD_REQUEST error when class cannot be found', async () => {
    // Mocking Model.findOne to return null
    jest.spyOn(Class, 'findOne').mockResolvedValue(null);

    const reqClassCode = 'class code that cannot be found';
    const reqClassName = 'P1 Integrity';
    await expect(
      updateClassNameByClassCode(reqClassCode, reqClassName)
    ).rejects.toThrowError(new Error('BAD_REQUEST'));
    expect(Class.findOne).toBeCalledWith({
      where: {
        code: {
          [Op.eq]: reqClassCode,
        },
      },
    });
  });
});
