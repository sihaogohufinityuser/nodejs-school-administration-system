import {
  validateStudentListingRequest,
  mergeSortOffsetLimitExternalAndLocalStudents,
} from 'services/StudentListingService';

describe('testing validateStudentListingRequest', () => {
  test('validateStudentListingRequest should return BAD_REQUEST error when either parameters is empty', () => {
    expect(() => {
      validateStudentListingRequest('', '5', '10');
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateStudentListingRequest('P1-1', '', '10');
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateStudentListingRequest('P1-1', '5', '');
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateStudentListingRequest('P1-1', '5', '10');
    }).not.toThrow();
  });
  test('validateStudentListingRequest should return BAD_REQUEST error when either reqOffset or reqLimit is not number parseable', () => {
    expect(() => {
      validateStudentListingRequest('P1-1', 'abc', '10');
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateStudentListingRequest('P1-1', '5', 'abc');
    }).toThrowError(new Error('BAD_REQUEST'));
  });
  test('mergeSortOffsetLimitExternalAndLocalStudents should return correct API response based on provided data', async () => {
    expect(
      mergeSortOffsetLimitExternalAndLocalStudents(
        {
          count: 3,
          students: [
            {
              id: 6,
              name: 'Joyce',
              email: 'joyce@gmail.com',
            },
            {
              id: 0,
              name: 'Alvinia',
              email: 'alvinia@gmail.com',
            },
            {
              id: 7,
              name: 'Adelle',
              email: 'adelle@gmail.com',
            },
          ],
        },
        {
          count: 2,
          rows: [
            {
              Student: {
                id: 2,
                name: 'Common Student 2',
                email: 'commonstudent2@gmail.com',
              },
            },
            {
              Student: {
                id: 3,
                name: 'Student 3',
                email: 'student3@gmail.com',
              },
            },
          ],
        },
        '1',
        '3'
      )
    ).toEqual({
      count: 5,
      students: [
        {
          id: 0,
          name: 'Alvinia',
          email: 'alvinia@gmail.com',
          group: 'external',
        },
        {
          id: 2,
          name: 'Common Student 2',
          email: 'commonstudent2@gmail.com',
          group: 'local',
        },
        {
          id: 6,
          name: 'Joyce',
          email: 'joyce@gmail.com',
          group: 'external',
        },
      ],
    });
  });
});
