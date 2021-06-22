import { sortAndRestructureWorkloadReport } from 'services/WorkloadReportService';

describe('testing WorkloadReportService', () => {
  test('sortAndRestructureWorkloadReport should return correct sorted API response based on provided data', async () => {
    expect(
      sortAndRestructureWorkloadReport([
        {
          numberOfClasses: 2,
          'Teacher.id': 3,
          'Teacher.name': 'Teacher 3',
          'Subject.code': 'MATHS',
          'Subject.name': 'Mathematics',
        },
        {
          numberOfClasses: 2,
          'Teacher.id': 1,
          'Teacher.name': 'Teacher 1',
          'Subject.code': 'SCI',
          'Subject.name': 'Science',
        },
        {
          numberOfClasses: 4,
          'Teacher.id': 2,
          'Teacher.name': 'Teacher 2',
          'Subject.code': 'SCI',
          'Subject.name': 'Science',
        },
        {
          numberOfClasses: 1,
          'Teacher.id': 2,
          'Teacher.name': 'Teacher 2',
          'Subject.code': 'MATHS',
          'Subject.name': 'Mathematics',
        },
        {
          numberOfClasses: 3,
          'Teacher.id': 4,
          'Teacher.name': 'Teacher 2',
          'Subject.code': 'MATHS',
          'Subject.name': 'Mathematics',
        },
      ])
    ).toEqual({
      'Teacher 1 [1]': [
        {
          subjectCode: 'SCI',
          subjectName: 'Science',
          numberOfClasses: 2,
        },
      ],
      'Teacher 2 [2]': [
        {
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          numberOfClasses: 1,
        },
        {
          subjectCode: 'SCI',
          subjectName: 'Science',
          numberOfClasses: 4,
        },
      ],
      'Teacher 2 [4]': [
        {
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          numberOfClasses: 3,
        },
      ],
      'Teacher 3 [3]': [
        {
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
          numberOfClasses: 2,
        },
      ],
    });
  });
});
