import {
  validateDataImport,
  populateDataObjectsFromJson,
  updateOrInsertDataObjects,
} from 'services/DataImportService';

describe('testing DataImportService', () => {
  test('validateDataImport should return BAD_REQUEST error when either one of the column has empty string', () => {
    expect(() => {
      validateDataImport([
        {
          teacherEmail: '',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '1',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: '',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '1',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: '',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '1',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: '',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '1',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: '',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '1',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: '',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '1',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: '',
          subjectName: 'Mathematics',
          toDelete: '1',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: '',
          toDelete: '1',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '1',
        },
      ]);
    }).not.toThrow();
  });
  test('validateDataImport should return BAD_REQUEST error when toDelete is not in [0,1]', () => {
    expect(() => {
      validateDataImport([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '5',
        },
      ]);
    }).toThrowError(new Error('BAD_REQUEST'));
  });
  test('populateDataObjectsFromJson should return correct data objects based on CSV column values', () => {
    expect(
      populateDataObjectsFromJson([
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent1@gmail.com',
          studentName: 'Common Student 1',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '0',
        },
        {
          teacherEmail: 'teacher1@gmail.com',
          teacherName: 'Teacher 1',
          studentEmail: 'commonstudent2@gmail.com',
          studentName: 'Common Student 2',
          classCode: 'P1-1',
          classname: 'P1 Integrity',
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          toDelete: '0',
        },
      ])
    ).toEqual([
      new Map([
        [
          'teacher1@gmail.com',
          {
            email: 'teacher1@gmail.com',
            name: 'Teacher 1',
          },
        ],
      ]),
      new Map([
        [
          'commonstudent1@gmail.com',
          {
            email: 'commonstudent1@gmail.com',
            name: 'Common Student 1',
          },
        ],
        [
          'commonstudent2@gmail.com',
          {
            email: 'commonstudent2@gmail.com',
            name: 'Common Student 2',
          },
        ],
      ]),
      new Map([
        [
          'P1-1',
          {
            code: 'P1-1',
            name: 'P1 Integrity',
          },
        ],
      ]),
      new Map([
        [
          'MATHS',
          {
            code: 'MATHS',
            name: 'Mathematics',
          },
        ],
      ]),
      [
        {
          teacherEmail: 'teacher1@gmail.com',
          studentEmail: 'commonstudent1@gmail.com',
          classCode: 'P1-1',
          subjectCode: 'MATHS',
          toDelete: 0,
        },
        {
          teacherEmail: 'teacher1@gmail.com',
          studentEmail: 'commonstudent2@gmail.com',
          classCode: 'P1-1',
          subjectCode: 'MATHS',
          toDelete: 0,
        },
      ],
    ]);
  });
});
